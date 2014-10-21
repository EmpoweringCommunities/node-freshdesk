module.exports = function(url, apikey) {
    var request = require('request');
    var auth = 'Basic ' + new Buffer(apikey + ':X').toString('base64')
    var fresh = {
        get: function(link, callback) {
            request(
                {
                    url: url + link,
                    headers: {
                        'Authorization' : auth
                    }
                },
                callback
            );
        },

        post: function(link, data, callback) {
            request.post(
                {
                    url: url + link,
                    json: data,
                    headers: {
                        'Authorization' : auth
                    }
                },
                callback
            );
        },

        put: function(link, data, callback) {
            request.put(
                {
                    url: url + link,
                    json: data,
                    headers: {
                        'Authorization' : auth
                    }
                },
                callback
            );
        }
    };

    return {
        postTicket: function(ticket, callback) {
            fresh.post('/helpdesk/tickets.json', ticket, callback);
        },

        putTicket: function(id, ticket, callback) {
            fresh.put(
                '/helpdesk/tickets/' + id +'.json',
                ticket,
                callback
            );
        },

        getTickets: function(callback) {
            fresh.get('/helpdesk/tickets.json', callback);
        },

        getTicket: function(id, callback){
            fresh.get('/helpdesk/tickets/' + id + '.json', callback);
        },

        getCategories: function(callback){
            // View All Forum Category
            fresh.get('/categories.json', callback);
        },

        getCategory: function(categoryId, callback){
            // View Forum Category
            fresh.get('/categories/' + categoryId + '.json', callback);
        },

        getForum: function(categoryId, forumId, callback){
            // View Forum
            fresh.get('/categories/' + categoryId + '/forums/' + forumId + '.json', callback);
        },

        getTopic: function(categoryId, forumId, topicId, callback){
            // View Topic
            fresh.get('/categories/' + categoryId + '/forums/' + forumId + '/topics/' + topicId + '.json', callback);
        },

        postNoteToTicket: function(id, note, is_private, callback){
            var data = {
                'helpdesk_note':
                {
                    'body': note,
                    'private': is_private
                }
            };
            fresh.post('/helpdesk/tickets/' + id + '/conversations/note.json',
                data, callback);
        },

        postContact: function(contact, callback) {
            fresh.post('/contacts.json', contact, callback);
        },

        putContact: function(id, contact, callback) {
            fresh.put('/contacts/' + id + '.json', contact, callback);
        },

        getContacts: function(callback) {
            fresh.get('/contacts.json?state=all', callback);
        },

        getContactByEmail: function(email, callback) {
            fresh.get(
                '/contacts.json?state=all&query=email%20is%20' + email,
                function(err, response, body) {
                    var users = JSON.parse(body);
                    if (users.length !== 0) {
                        return callback(users[0]);
                    }
                    return callback(null);
                }
            );
        }
    };
};
