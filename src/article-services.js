import _ from 'lodash';

export default class ArticleService {

	constructor() {
	}

	allArticles(articles) {
        if (articles.length > 0) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const previews = [];
            const archives = [];
            const tags = [];
            articles.sort((a,b) => b.createdAt - a.createdAt);
            articles.forEach(article => {
                let date = new Date(article.createdAt)
                previews.push({
                    title: article.title,
                    body: article.body.substring(0,200) + '...',
                    author: article.author,
                    slug: article.slug,
                    tags: article.tags,
                    createdAt: article.createdAt
                });        
                archives.push(`${months[date.getMonth()]} ${date.getFullYear()}`);
                tags.push(...article.tags);
            });
            return {previews, archives: _.uniq(archives), tags: _.uniq(tags)};
        }

        return;
	}

	getSlug(article) {
        let slug = this.slugify(article.title);
        article.slug = slug;
        return article;
	}

	articlesByTag(articles, tag) {
        if (articles.length > 0) {
            return articles.filter(article => article.tags.includes(tag)).sort((a,b) => b.createdAt - a.createdAt);
        } 
        return;
	}

	articlesByArchive(articles, archive) {
		let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (articles.length > 0) {
            return articles.filter(article => {
                const date = new Date(article.createdAt);
                return archive === `${months[date.getMonth()]} ${date.getFullYear()}`;
            }).sort((a,b) => b.createdAt - a.createdAt);
        }
        return;
	}

	slugify(text) {
		return text.toString().toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
	}

}
