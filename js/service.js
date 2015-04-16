var dataService = (function() {

  var onError = function(err) {
    alert("Error: " + error.code + " " + error.message);
  };

  AV.$ = jQuery;
  AV.initialize(appId, appKey);

  var Wish = AV.Object.extend("Wish");

  return {
    getWishItems: function(page, callback) {
      var query = new AV.Query(Wish);
      query.skip(itemPerPage * page).limit(itemPerPage);
      query.descending("createdAt");
      query.find().then(function(items) {
        callback(null, items);
      }, function(err) {
        onError(err);
        callback(err);
      });
    },

    getWishItemById: function(id, callback) {
      var query = new AV.Query(Wish);
      query.equalTo("objectId", id);
      query.first().then(function(item) {
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
        alert("Error: " + error.code + " " + error.message);
        callback(err);
      });
    },

    voteUpItem: function(id, callback) {
      callback();
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
