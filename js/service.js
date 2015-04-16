var dataService = (function() {

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
        alert("Error: " + error.code + " " + error.message);
        callback(err);
      });
    },

    getWishItemById: function(id, callback) {
      var query = new AV.Query(Wish);
      query.equalTo("objectId", id);
      query.first().then(function(item) {
          callback(null, item);
        }, function(err) {
          alert("Error: " + error.code + " " + error.message);
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
  };

}());
