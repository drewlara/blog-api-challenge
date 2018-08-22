const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("BlogPost", function(){
	before(function(){
		return runServer();
	});

  after(function(){
    return closeServer();
  });

  //GET
  it("should list blog posts on GET", function(){
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item){
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  //POST
  it("should create blog post on POST", function(){
    const newPost = {
      title: "Test blog post",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      author: "Alex",
      publishDate: "August 21 2018"
    }
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object")
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        expect(res.body.title).to.not.equal(null);
        expect(res.body.content).to.not.equal(null);
        expect(res.body.author).to.not.equal(null);
        expect(res.body.publishDate).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  //PUT
  it("should update blog posts on PUT", function(){
    const postUpdate = {
      title: "Update test blog post",
      content: "Lorem ipsum dolor sit",
      author: "Tester",
      publishDate: "August 22 2018"
    }
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res){
        postUpdate.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${postUpdate.id}`)
          .send(postUpdate)
      })
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(postUpdate);
      })
  });

  //DELETE
  it("should delete blog posts on DELETE", function(){
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res){
        return chai
          .request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res){
        expect(res).to.have.status(204);
      });
  });

});