/*******************************************
 * RecordId class for knockout-sync
 *******************************************/
(function(ko) {
   "use strict";

//   ko.sync || (ko.sync = {});

   var RecordId = ko.sync.RecordId = Class.extend({
      /**
       * @param {Array|string} fields
       * @param {object} [data]
       * @param {string} [separator]
       * @constructor
       */
      init: function(fields, data, separator) {
         _.isArray(fields) || (fields = fields? [fields] : []);
         this.separator = separator || RecordId.DEFAULT_SEPARATOR;
         this.multi = fields.length > 1;
         this.fields = fields;
         this.hash = _createHash(this.separator, fields, data);
         this.tmpId = _isTempId(this.hash);
      },
      isSet:              function() { return !this.tmpId; },
      isComposite:        function() { return this.multi; },
      hashKey:            function() { return this.hash; },
      toString:           function() { return this.hashKey(); },
      getCompositeFields: function() { return this.fields; },

      /**
       * @param {String|Object} hashOrData
       */
      update: function(hashOrData) {
         var h = typeof(hashOrData)==='string'? hashOrData : _createHash(this.separator, this.fields, hashOrData);
         if( !_isTempId(h) ) {
            this.hash = h;
            this.tmpId = false;
         }
         else {
            console.warn('tried to update ID with a temp id; ignored');
         }
         return this;
      },

      /**
       * @return {object} the field/value pairs used to create this key.
       */
      parse: function() {
         return RecordId.parse(this.hash, this.fields, this.separator);
      },

      equals:             function(o) {
         // it is possible to match a RecordId even if it has no key, because you can check the Record's ID
         // against this one to see if they are actually the same instance this has some limitations but it
         // can work as long as one is careful to always use the ID off the record and never grow new ones
         if( !this.isSet() ) { return o === this; }
         // assuming they are not the same instance, it's easiest to check the valueOf() attribute
         return (o instanceof RecordId && o.hashKey() === this.hashKey())
               || (typeof(o) === 'string' && o === this.hashKey());
      }
   });
   RecordId.DEFAULT_SEPARATOR = '|||';

   /**
    * @param {Model} model
    * @param {Record|Object} record
    * @return {RecordId}
    */
   RecordId.for = function(model, record) {
      var data = record instanceof RecordId? record.getData() : record;
      return new RecordId(model.key, data);
   };
   RecordId.parse = function(hashKey, fields, separator) {
      var out = {}, vals;
      if( !_isTempId(hashKey) ) {
         if( fields.length > 1 ) {
            separator || (separator = RecordId.DEFAULT_SEPARATOR);
            vals = hashKey.split(separator);
            _.each(fields, function(k, i) {
               out[k] = vals[i];
            });
         }
         else {
            out[fields[0]] = hashKey;
         }
      }
      return out;
   };

   function _isTempId(hash) {
      // the parts of a temporary id are "tmp" followed by the ko.sync.instanceId (a timestamp, a colon,
      // and a random number), and a uuid all joined by "."
      return (hash && hash.match(/^tmp[.][0-9]+:[0-9]+[.]/))? true : false;
   }

   function _createTempHash() {
      return _.uniqueId('tmp.'+ko.sync.instanceId+'.');
   }

   function _createHash(separator, fields, data) {
      if( typeof(data) === 'object' && !_.isEmpty(data) ) {
         var s = '', f, i = -1, len = fields.length;
         while(++i < len) {
            f = fields[i];
            // if any of the composite key fields are missing, there is no key value
            if( !exists(data[f]) ) {
               return _createTempHash();
            }
            if( i > 0 ) { s += separator; }
            s += data[f];
         }
         return s;
      }
      else {
         return _createTempHash();
      }
   }

   function exists(v) {
      return v !== null && v !== undefined;
   }

   function KeyFactory(model, tmpField) {
      this.model = model;
      this.tmpField = tmpField === true? ko.sync.Record.TEMPID_FIELD : tmpField;
   }
   KeyFactory.prototype.make = function(data) {
      var id = ko.sync.RecordId.for(this.model, data);
      return id.isSet()? id.hashKey() : (this.tmpField? data[this.tmpField] : null);
   };

   ko.sync.KeyFactory = KeyFactory;

})(ko);

