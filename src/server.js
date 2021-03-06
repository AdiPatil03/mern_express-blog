import express from 'express';
import articles from './resources/articles.json';
import users from './resources/users.json';
import bodyParser from 'body-parser';
import path from 'path';
import {MongoClient} from 'mongodb';
import _ from 'lodash';
import ArticleService from './article-services';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/build')));

const articleService = new ArticleService();

const withDB = async (operations, res) => {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
        const db = client.db('mern-blog');

        await operations(db);

        client.close();
    } catch(error) {
        res.status(500).json({message: 'db-connection', error});
    }
};

const loadData = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = client.db('mern-blog');

    await db.collection('users').insertMany(users);
    await db.collection('articles').insertMany(articles);

    client.close();
};

loadData();

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;
    
    withDB(async db => {
        const userInfo = await db.collection('users').findOne({username, password});
        
        if (!_.isNull(userInfo)) {
            res.status(200).json({user: userInfo.username});
        } else {
            res.status(400).json({message: 'invalid-credentials'});    
        }
    }, res);

});

app.post('/api/signup', async (req, res) => {
    const {username, password} = req.body;
    
    withDB(async db => {
        const existingUser = await db.collection('users').findOne({username});
        
        if (_.isNull(existingUser)) {
            const insertInfo = await db.collection('users').insertOne({username, password});
            if (!_.isUndefined(insertInfo.insertedId)) {
                res.status(200).json({user: username});
            }
        } else {
            res.status(400).json({message: 'user-exists'});
        }
    }, res);

});

app.post('/api/new-article', async (req, res) => {
    let article = req.body;
    withDB(async db => {
        const articleInfo = articleService.getSlug(article);

        const insertInfo = await db.collection('articles').insertOne({...articleInfo});
        if (!_.isUndefined(insertInfo.insertedId)) {
            res.status(200).json({slug: article.slug});
        }
    }, res);
});

app.post('/api/update-article/:name', async (req, res) => {
    const articleName = req.params.name;
    const article = req.body;

    withDB(async db => {
        const originalArticle = await db.collection('articles').findOne({slug: article.slug});
        const newSlug = articleService.slugify(article.title)

        if (!_.isNull(originalArticle)) {
            await db.collection('articles').updateOne({slug: article.slug}, {
                '$set': {
                    slug: newSlug,
                    title: article.title,
                    body: article.body,
                    tags: article.tags
                }
            });
            res.status(200).json({slug: newSlug});
        } else {
            res.status(400).json({message: 'update-failed'});
        }
    }, res);
});

app.get('/api/all-articles', async (req, res) => {
    withDB(async db => {
        const articles = await db.collection('articles').find({}).toArray();

        const initialData = articleService.allArticles(articles);
        if (!_.isUndefined(initialData)) {
            res.status(200).json({...initialData});
        } else {
            res.status(400).json({message: 'no-article-written'});
        }
    }, res);
});

app.get('/api/article/:name', async (req, res) => {
    withDB(async db => {
        const slug = req.params.name;
        
        const articleInfo = await db.collection('articles').findOne({slug});
        if (_.isNull(articleInfo)) {
            res.status(400).json({message: 'article-not-found'});
        } else {
            res.status(200).json(articleInfo);
        }
    }, res);

});

app.get('/api/tag/:name', async (req, res) => {
    withDB(async db => {
        const tagName = req.params.name;
        
        const articleInfo = await db.collection('articles').find({}).toArray();
        const articles = articleService.articlesByTag(articleInfo, tagName);
        if (articles && articles.length > 0) {
            res.status(200).json([...articles]);
        } else{
            res.status(400).json({message: `article-not-found`});
        }
    }, res);

});

app.get('/api/archive/:name', async (req, res) => {
    withDB(async db => {
        const archiveName = req.params.name;
        
        const articleInfo = await db.collection('articles').find({}).toArray();
        const articles = articleService.articlesByArchive(articleInfo, archiveName);
        if (articles && articles.length > 0) {
            res.status(200).json([...articles]);
        } else{
            res.status(400).json({message: `article-not-found`});
        }
    }, res);

});

app.post('/api/article/:name/upvote', async (req, res) => {
    withDB(async db => {
        const articleName= req.params.name;
    
        const articleInfo = await db.collection('articles').findOne({name: articleName});
        db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                upvotes: articleInfo.upvotes + 1
            }
        });
        
        const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});
        res.status(200).json(updatedArticleInfo);
    }, res);

});

app.post('/api/article/:name/add-comment', async (req, res) => {
    withDB(async db => {
        const articleName = req.params.name;
        const {username, comment} = req.body;

        const articleInfo = await db.collection('articles').findOne({name: articleName});
        db.collection('articles').updateOne({name: articleName}, {
            '$set': {
                comments: articleInfo.comments.concat({username, comment})
            }
        });

        const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});
        res.status(200).json(updatedArticleInfo);
    }, res);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen('3010', () => console.log('listening port 3010!'));
