$.templates({
	comment: '\
			<div class="comment">\
				<a class="author-photo" href="#view-profile" data-profile-id="{{:profile.id}}">\
					<img src="{{:profile.avatar}}"/>\
				</a>\
				<div class="comment-header clearfix">\
					<a class="author-name" href="#view-profile" data-profile-id="{{:profileId}}">{{:profile.name}}</a>\
					<span class="comment-time">{{:created_at}}</span>\
				</div>\
				{{for quotes tmpl="quote" /}}\
				{{if content }}<div class="comment-content">{{:content}}</div>{{/if}}\
			</div>',
	quote: '<div class="comment-quote">\
				<a class="quote-photo" href="#view-profile" data-profile-id="{{:profile.id}}">\
					<img src="{{:profile.avatar}}"/>\
				</a>\
				<div class="quote-header clearfix">\
					<a class="author-name quote-name" href="#view-profile" data-profile-id="{{:profile.id}}">{{:profile.name}}</a>\
					<a class="quote-link" href="#view-original" data-post-id="{{:id}}">View Original</a>\
				</div>\
				<div class="quote-content">{{:content}}</div>\
			</div>\
			<div class="comment-content">{{:reply}}</div>'
});