var dataService = (function() {

  var onError = function(err) {
    console.log("Error: " + err.code + " " + err.message);
    alert("Error: " + err.message);
  };

  AV.$ = jQuery;
  AV.initialize(appId, appKey);

  var Wish = AV.Object.extend("Wish");
  var Vote = AV.Object.extend("Vote");
  var Comment = AV.Object.extend("Comment");

  var getUser = function() {
    return AV.User.current();
  };

  return {
    getWishItems: function(page, callback) {
      var wishitems = null;
      var hasMore = false;
      var query = new AV.Query(Wish);

      query.skip(itemPerPage * page)
      .limit(itemPerPage + 1)
      .descending("createdAt")
      .find()
      .then(function(items) {
        if (items.length > itemPerPage) {
          hasMore = true;
          items.splice(itemPerPage);
        }

        wishitems = items;
        var promises = [];
        wishitems.forEach(function(item) {
          var author = item.get('author');
          promises.push(author.fetch());
        });
        return AV.Promise.when(promises);
      }).then(function() {
        var authors = arguments;
        for (var i = 0; i < authors.length; i++) {
          wishitems[i].author = authors[i];
        }

        if (!getUser()) {
          return callback(null, wishitems);
        }

        var promises = [];
        wishitems.forEach(function(item) {
          var query = new AV.Query(Vote);
          query.equalTo('user', getUser())
          .equalTo('wish', item);
          promises.push(query.count());
        });

        return AV.Promise.when(promises).then(function() {
          var votes = arguments;
          for (var i = 0; i < votes.length; i++) {
            wishitems[i].voteUpAlready = (votes[i] > 0);
          }

          callback(null, wishitems, hasMore);
        });

      }).fail(function(err) {
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
      }).fail(function(err) {
        onError(err);
        callback(err);
      }
      );
    },

    postNewWishItem: function(item_new, callback) {
      var wish = new Wish();
      wish.save(item_new).then(function(item) {
        var author = item.get('author');
        return author.fetch().then(function(author) {
          item.author = author;
          callback(null, item);
        });
      }).fail(function(err) {
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

    deleteWishItem: function(item, callback) {
      item.destroy()
      .then(function() {
        callback();
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    voteUpItem: function(item, callback) {
      var query = new AV.Query(Vote);
      query.equalTo('user', getUser())
      .equalTo('wish', item)
      .count()
      .then(function(count) {
        if (count > 0) {
          return callback(null, true);
        }

        var vote = new Vote();
        return vote.save({
          user: getUser(),
          wish: item,
        }).then(function() {
          item.increment('voteup');
          return item.save()
        }).then(function() {
          callback();
        });

      }).fail(function(err) {
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

    getUser: getUser,
  };

}());
