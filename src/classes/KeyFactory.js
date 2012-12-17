
(function(ko) {

   /**
    * @param {ko.sync.Model} model
    * @param {boolean} [hashKeyField]
    * @constructor
    */
   ko.sync.KeyFactory = function(model, hashKeyField) {
      this.model = model;
      this.fields = _.isArray(model.key)? model.key : [model.key];
      this.hashKeyField = hashKeyField === true? KeyFactory.HASHKEY_FIELD : hashKeyField;
   };
   ko.sync.KeyFactory.prototype.make = function(data) {
      if( this.hashKeyField && _.has(data, this.hashKeyField) && data[this.hashKeyField] ) {
         return data[this.hashKeyField];
      }
      else {
         return ko.sync.RecordId.for(this.model, data).hashKey();
      }
   };
   ko.sync.KeyFactory.HASHKEY_FIELD = '_hashKey';

   var KeyFactory = ko.sync.KeyFactory;

})(ko);

