var dataService = (function() {

  var onError = function(err) {
    console.log("Error: " + err.code + " " + err.message);
    alert("Error: " + err.message);
  };

  AV.$ = jQuery;
  AV.initialize(appId, appKey);

  var Wish = AV.Object.extend("Wish");

  return {
    getWishItems: function(page, callback) {
      var query_sum = new AV.Query(Wish);
      var wishitems = null;
      var wishItemSum = 0;

      query_sum.count()
      .then(function(count) {
        wishItemSum = count;

        var query = new AV.Query(Wish);

        return query.skip(itemPerPage * page)
        .limit(itemPerPage)
        .descending("createdAt")
        .find();
      }).then(function(items) {
        wishitems = items;
        var promises = [];
        items.forEach(function(item) {
          var author = item.get('author');
          promises.push(author.fetch());
        });
        return AV.Promise.when(promises);
      }).then(function() {
        var authors = arguments;
        for (var i = 0; i < authors.length; i++) {
          wishitems[i].author = authors[i];
        }

        callback(null, wishitems, wishItemSum);

      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    getWishItemById: function(id, callback) {
      var query = new AV.Query(Wish);

      query.equalTo("objectId", id)
      .first()
      .then(function(item) {
        callback(null, item);
      }, function(err) {
        onError(err);
        callback(err);
      }
      );
    },

    postNewWishItem: function(item, callback) {
      var wish = new Wish();
      wish.save(item).then(function(item) {
        callback(null, item);
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    updateWishItem: function(item, description, callback) {
      item.save({ description: description })
      .then(function() {
        callback();
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    voteUpItem: function(item, callback) {
      item.increment('voteup');
      item.save()
      .then(function() {
        callback();
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    register: function(email, password, callback) {
      AV.User.signUp(email, CryptoJS.MD5(password).toString(), {email: email})
      .then(function(user) {
        callback(null, user);
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    login: function(email, password, callback) {
      AV.User.logIn(email, CryptoJS.MD5(password).toString())
      .then(function(user) {
        callback(null, user);
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    logout: function() {
      AV.User.logOut();
    },

    getUser: function() {
      return AV.User.current();
    },
  };

}());
