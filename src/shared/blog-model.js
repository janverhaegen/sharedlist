const { Jinaga: j, ensure } = require("jinaga");

class User {
    constructor (
        publicKey
    ) {
        this.type = User.Type
        this.publicKey = publicKey
    }
}
User.Type = "Jinaga.User";

class Post {
    constructor (
        created,
        author
    ) {
        this.type = Post.Type;
        this.created = created;
        this.author = author;
    }
}
Post.Type = "Blog.Post";

Post.byAuthor = function(author) {
    return j.match({
        type: "Blog.Post",
        author
    });
};

Post.author = function(post) {
    ensure(post).has("author");
    return j.match(post.author);
}

class Tag {
    constructor (
        name
    ) {
        this.type = Tag.Type;
        this.name = name;
    }
}
Tag.Type = "Blog.Tag";

Tag.forPost = function(post) {
    return j.match({
        type: "Blog.Post.Tags",
        post
    });
};

class PostTags {
    constructor (
        post,
        tags
    ) {
        this.type = PostTags.Type;
        this.post = post;
        this.tags = tags;
    }
}
PostTags.Type = "Blog.Post.Tags";

PostTags.tags = function(postTags) {
    ensure(postTags).has("tags");

    return j.match(postTags.tags);
};

PostTags.post = function(postTags) {
    ensure (postTags).has("post");
    return j.match(postTags.post);
}

function authorize(a) {
    return (a
        .any(User.Type)
        .type(Post.Type, j.for(Post.author))
        .any(Tag.Type)
        .type(PostTags.Type, j.for(PostTags.post).then(Post.author))
    );
}

module.exports = {
    User,
    Post,
    Tag,
    PostTags,
    authorize
};