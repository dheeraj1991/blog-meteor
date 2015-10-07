if (Meteor.isServer) {
    Meteor.methods({
        getArticles: function () {
            this.unblock();
            return Meteor.http.get("http://localhost:8000/articles/", {timeout:30000});
        }
    });
    Meteor.methods({
        randomContent: function () {
            this.unblock();
            return Meteor.http.get("http://localhost:8000/random/", {timeout:30000});
        }
    });
    Meteor.methods({
        getSpecificArticle: function (id) {
            this.unblock();
            return Meteor.http.get("http://localhost:8000/articles/" + id, {timeout:30000});
        }
    });
}

if (Meteor.isClient) {

    Meteor.call("getArticles", function(error, results) {
         Session.set('articles', JSON.parse(results.content).articles);
    });

    Meteor.call("randomContent", function(error, results){
        Session.set('mainarticle', JSON.parse(results.content).article);
        Session.set('images', JSON.parse(results.content).images);
        Session.set('specific', null);
    })

  Template.body.helpers({
      images: function(){
        return Session.get('images');
      }
  });

  // This code only runs on the client
  Template.main.helpers({
      articles: function(){
        return Session.get('articles');
      },
      mainarticles: function(){
        return Session.get('mainarticle');
      },
      specific: function(){
        return Session.get('specific');
      }
  });

  Template.body.events({
    "click .article-content": function(event){
      event.preventDefault();
      var id = event.currentTarget.id;
      Session.set('specific', true);
      Session.set('articles', null);
      Meteor.call("getSpecificArticle", id, function(error, results) {
         Session.set('mainarticle', JSON.parse(results.content).article);
      });
    }
  });
}

