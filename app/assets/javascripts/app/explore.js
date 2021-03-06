App.addChild('Explore', _.extend({
  el: '.content[data-action="index"][data-controller-name="explore"]',

  events: {
    'click .explore-toggle':'toggleCategoryList'
  },

  routeFilters: {
    recent: { recent: true },
    in_funding: { in_funding: true },
    expiring: { expiring: true },
    recommended: { recommended: true },
    successful: { successful: true }
  },

  activate: function(){
    this.$loader = this.$("#loading img");
    this.$loaderDiv = this.$("#loading");
    this.$results = this.$(".results");
    this.path = this.$("#explore_results").data('projects-path');

    this.route('recommended');
    this.route('expiring');
    this.route('recent');
    this.route('in_funding');
    this.route('successful');
    this.route('by_category_id/:id');
    this.route('near_of/:state');

    this.setInitialFilter();
    this.setupScroll();

    if(window.location.hash == ''){
      this.fetchPage();
    }
  },

  toggleCategoryList: function(event) {
    this.$('#categories-wrapper').slideToggle();
  },

  selectLink: function(){
    this.$('.follow-category').hide();
    this.toggleCategoryList();

    var link = this.$('a[href="' + window.location.hash + '"]')
    this.$('a.selected').removeClass('selected');

    link.addClass('selected');

    if(link.data('categoryid') || link.data('name')) {
      this.followCategory.setupFollowHeader(link);
    }
  },

  followRoute: function(route, name, params){
    this.filter = {};
    if(params.length > 0){
      this.filter[name] = params[0];
    }
    else{
      this.filter[name] = true;
    }
    this.firstPage();
    this.fetchPage();
    if(this.parent && this.parent.$search.length > 0){
      this.parent.$search.val('');
    }
    this.selectLink();
  },

  setInitialFilter: function(){
    var search = null;;
    if(this.parent && (search = this.parent.$search.val())){
      this.filter = { pg_search: search };
    }
    else{
      this.filter = {
        recommended: true,
        not_expired: true
      };
    }
  },

}, Skull.InfiniteScroll));

App.views.Explore.addChild('FollowCategory', {
  el: '.follow-category',

  setupFollowHeader: function(selectedItem) {
    var unfollow_btn = this.$('.unfollow-btn');
    var follow_btn = this.$('.follow-btn');

    this.$('.btn.btn-medium').hide();
    this.$('.category-info').html(selectedItem.data('name'));
    this.$('.following').hide();

    if(selectedItem.data('categoryid') > 0) {
      this.$('.category-follow span.count').html(selectedItem.data('totalfollowers'));

      if(selectedItem.data('totalfollowers') > 0) {
        this.$('.following').show();
      }

      if(selectedItem.data('isfollowing')) {
        unfollow_btn.prop('href', selectedItem.data('unfollowpath'))
        unfollow_btn.show();
      } else {
        follow_btn.prop('href', selectedItem.data('followpath'))
        follow_btn.show();
      }
    }

    this.$el.show();
  }

});

