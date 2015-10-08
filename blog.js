BASE_URL = "https://blog-article.herokuapp.com"
if (Meteor.isServer) {
    Meteor.methods({
        getArticles: function () {
            return Meteor.http.get(BASE_URL + "/articles/", {timeout:30000});
        }
    });
    Meteor.methods({
        randomContent: function () {
            return Meteor.http.get(BASE_URL + "/random/", {timeout:30000});
        }
    });
    Meteor.methods({
        getSpecificArticle: function (id) {
            return Meteor.http.get(BASE_URL + "/articles/" + id, {timeout:30000});
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
      },
      isspecific: function(){
        return Session.get('specific');
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

  Template.article.rendered = function() {
      $('.listContent').each(function(index){
          truncated = $(this).text();
          if (truncated.length > 300) {
            truncated = truncated.substr(0,300) + '...';
          }
          $(this).text(truncated);
      });
  }

  Template.body.events({
    "click .article-content": function(event){
      event.preventDefault();
      var id = event.currentTarget.id;
      Session.set('specific', true);
      Session.set('articles', null);
      Meteor.call("getSpecificArticle", id, function(error, results) {
         Session.set('mainarticle', JSON.parse(results.content).article);
      });
    },
    "click #back": function(event){
      event.preventDefault();
      Session.set('specific', null);
      Meteor.call("getArticles", function(error, results) {
           Session.set('articles', JSON.parse(results.content).articles);
      });

      Meteor.call("randomContent", function(error, results){
          Session.set('mainarticle', JSON.parse(results.content).article);
          Session.set('images', JSON.parse(results.content).images);
          Session.set('specific', null);
      });
    }
  });
}

