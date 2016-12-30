const fse = require('fs-extra');
const process = require('process');
const path = require('path');

const Handlebars = require('handlebars');
const matter = require('gray-matter');
const marked = require('marked');
const moment = require('moment');
const glob = require('glob');

const loadConfig = require('./load-config');

marked.setOptions({
    gfm: true,
    breaks: true,
});

function generate() {
    const config = loadConfig();
    const cwd = process.cwd();
    const postTemplate = Handlebars.compile(fse.readFileSync(path.join(cwd, 'skin', 'post.hbs'), 'utf8'));
    const postFilePaths = glob.sync(path.join(cwd, 'posts') + '/*.md');
    fse.ensureDirSync(path.join(cwd, 'blog'));
    const posts = [];
    const postsByTag = {};
    for (let postFilePath of postFilePaths) {
        const postFile = matter.read(postFilePath);
        const content = marked(postFile.content);
        const slug = path.basename(postFilePath, path.extname(postFilePath));
        let tags = [];
        if (postFile.data['tags']) {
            tags = postFile.data['tags'].split(',').map(s => s.trim());
        }
        const post = {
            content: content,
            title: postFile.data['title'],
            date: postFile.data['date'],
            tags: tags,
            prettyDate: moment(postFile.data['date']).format('Do MMMM, YYYY'),
            slug: slug,
        };
        for (let tag of tags) {
            if (! postsByTag[tag]) {
                postsByTag[tag] = [];
            }
            postsByTag[tag].push(post);
        }
        posts.push(post);
        const output = postTemplate({
            post: post,
            blog: config,
        });
        const dirName = path.join(cwd, 'blog', slug);
        fse.ensureDirSync(dirName);
        fse.writeFileSync(path.join(dirName, 'index.html'), output);
    }
    const indexTemplate = Handlebars.compile(fse.readFileSync(path.join(cwd, 'skin', 'index.hbs'), 'utf8'));
    posts.sort((a, b) => a.date < b.date); // sort in descending order of date
    fse.writeFileSync(path.join(cwd, 'blog', 'index.html'), indexTemplate({
        posts: posts,
        blog: config,
    }));
    const tagListTemplate = Handlebars.compile(fse.readFileSync(path.join(cwd, 'skin', 'tag-list.hbs'), 'utf8'));
    fse.ensureDirSync(path.join(cwd, 'blog', 'tag'));
    for (tag in postsByTag) {
        fse.ensureDirSync(path.join(cwd, 'blog', 'tag', tag));
        let posts = postsByTag[tag].sort((a, b) => a.date < b.date);
        fse.writeFileSync(path.join(cwd, 'blog', 'tag', tag, 'index.html'), tagListTemplate({
            posts: posts,
            blog: config,
            tag: tag,
        }));
    }
}

module.exports = generate;
