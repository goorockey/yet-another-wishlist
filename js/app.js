var WishItem = React.createClass({
  render: function() {
    console.log(this.props);
    return (
      <div className="col-md-4" key={this.props.item.id}>
        <p>{this.props.item.get('description')}</p>
      </div>
    );
  },
});

var WishList = React.createClass({
  render: function() {
    var wishItem = this.props.wishlist.map(function(item) {
      return (
        <WishItem key={item.id} item={item} />
      );
    }.bind(this));

    return (
      <div className="wish-list">
        <div className="row">
          {wishItem}
        </div>
      </div>
    );
  },
});

var NavBar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <h1>Yet Another Wishlist</h1>
          </div>
        </div>
      </nav>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      wishlist: [],
      page: 0
    }
  },
  componentDidMount: function() {
    this.getWishItems();
  },
  getWishItems: function() {
    dataService.getWishItems(this.state.page, function(err, items) {
      if (err) { return; }

      if (!items || items.length === 0) {
        // TODO: disable inifinite scrolling
        return;
      }

      this.setState({
        wishlist: this.state.wishlist.concat(items)
      });
    }.bind(this));
  },
  next: function() {
    this.setState({page: this.state.page + 1}, this.getWishItem);
  },
  render: function() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <WishList wishlist={this.state.wishlist} />
        </div>
      </div>
    );
  },
});

React.render(<App />, document.getElementById('main'));
