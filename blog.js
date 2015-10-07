if (Meteor.isServer) {
    Meteor.methods({
        getArticles: function () {
            this.unblock();
            return Meteor.http.get("http://localhost:8000/articles/", {timeout:30000});
        }
    });
}

if (Meteor.isClient) {

    Meteor.call("getArticles", function(error, results) {
         Session.set('articles', JSON.parse(results.content).articles);
    });

  // This code only runs on the client
  Template.body.helpers({
      images: [
        { url: "/static/google.png" },
        { url: "/static/google.png" },
        { url: "/static/google.png" },
        { url: "/static/google.png" }
      ],
      articles: function(){
        return Session.get('articles');
      },
  });

  Template.body.events({
    "click .article-content": function(event){
      event.preventDefault();
      var id = event.currentTarget.id;
      console.log(id);
    }
  });
}

