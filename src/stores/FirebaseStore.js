
(function(ko) {
   var undef;

   function FirebaseStore(url, base) {
      this.base = new Firebase(url).child(base);
   }

   FirebaseStore.RECORD_ID = new Object();

   FirebaseStore.prototype.create = function(model, record) {
      return ko.sync.handle(this, function(cb, eb) { // creates a promise
         var table = this.base.child(model.dataTable),
             key = record.hasKey()? record.getKey() : undef,
             ref = _buildRecord(table, key);
         ref.set(cleanData(model.fields, record.getData()), function(success) {
            (success && cb(ref.name())) || eb(ref.name());
         });
      });
   };

   FirebaseStore.prototype.read         = function(model, recOrId) {
      return ko.sync.handle(this, function(cb) {
         var table = this.base.child(model.dataTable),
             key   = _idFor(recOrId),
             ref   = _buildRecord(table, key);
         ref.once('value', function(snapshot) {
            cb(snapshot.val());
         });
      });
   };

   FirebaseStore.prototype.update       = function(model, rec) {}; //todo
   FirebaseStore.prototype.delete       = function(model, recOrId) {}; //todo
   FirebaseStore.prototype.query        = function(model, params) {}; //todo

   FirebaseStore.prototype.sync         = function(callback) {}; //todo
   FirebaseStore.prototype.onDisconnect = function(callback) {}; //todo
   FirebaseStore.prototype.onConnect    = function(callback) {}; //todo

   /** UTILITIES
    *****************************************************************************************/

   /**
    * Create or load a record to receive data. For new records, data/key are not necessary.
    *
    * @param table
    * @param {string} [key]
    * @return {Firebase}
    * @private
    */
   function _buildRecord(table, key) {
      return key? table.child(key) : table.push();
   }

   function exists(data, key) {
      var val = data && key && data.hasOwnProperty(key)? data[key] : undef;
      return  val !== null && val !== undef;
   }

   function cleanData(fields, data) {
      var k, cleaned = {};
      for(k in fields) {
         if( fields.hasOwnProperty(k) ) {
            cleaned[k] = cleanValue(fields[k].type, data, k);
         }
      }
      return cleaned;
   }

   function getDefaultValue(type) {
      switch(type) {
         case 'boolean':
            return false;
         case 'int':
            return 0;
         case 'float':
            return 0;
         case 'string':
         case 'email':
         case 'date':
            return null;
         default:
            throw new Error('Invaild field type '+type);
      }
   }

   function cleanValue(type, data, k) {
      if( !exists(data, k) ) {
         return getDefaultValue(type);
      }
      else {
         var v = data[k];
         switch(type) {
            case 'boolean':
               return v? true : false;
            case 'int':
               v = parseInt(v);
               return isNaN(v)? getDefaultValue(type) : v;
            case 'float':
               v = parseFloat(v);
               return isNaN(v)? getDefaultValue(type) : v;
            case 'date':
               return _formatDate(v);
            case 'string':
            case 'email':
               return v + '';
            default:
               throw new Error('Invaild field type '+type);
         }
      }
   }

   function _formatDate(v) {
      if( typeof(v) === 'object' ) {
         if( v.toISOString ) {
            return v.toISOString();
         }
         else if( typeof(moment) === 'object' && moment.isMoment && moment.isMoment(v) ) {
            return moment.defaultFormat()
         }
      }
      return getDefaultValue('date');
   }

   function _idFor(recOrId) {
      if( typeof(recOrId) === 'object' && recOrId.getKey ) {
         return recOrId.getKey();
      }
      else {
         return recOrId;
      }
   }

   if (!Date.prototype.toISOString) {
      Date.prototype.toISOString = function() {
         function pad(n) { return n < 10 ? '0' + n : n }
         return this.getUTCFullYear() + '-'
               + pad(this.getUTCMonth() + 1) + '-'
               + pad(this.getUTCDate()) + 'T'
               + pad(this.getUTCHours()) + ':'
               + pad(this.getUTCMinutes()) + ':'
               + pad(this.getUTCSeconds()) + 'Z';
      };
   }

//
//   function isTempId(data, key) {
//      var v = data && key && data.hasOwnProperty(key)? data[key] : null;
//      return typeof(v) === 'number' && v < 0;
//   }
//
//   function isPermanentId(data, key) {
//      var v = data && key && data.hasOwnProperty(key)? data[key] : null;
//      return v && typeof(v) === 'string';
//   }

   /** ADD TO NAMESPACE
    ******************************************************************************/

   ko.sync || (ko.sync = {stores: []});
   ko.sync.stores.FirebaseStore = FirebaseStore;

})(ko);