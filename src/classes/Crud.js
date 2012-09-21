
(function(ko) {
   "use strict";

   /**
    * @param {Object}        target   an object, observable, or view containing the record data
    * @param {ko.sync.Model} model
    * @param {ko.sync.Record|Object} [recordOrData]
    * @constructor
    */
   ko.sync.Crud = function(target, model, recordOrData) {
      this.parent = target;
      this.def = $.Deferred().resolve().promise();
      if( recordOrData instanceof ko.sync.Record ) {
         this.record = recordOrData;
      }
      else {
         this.record = model.newRecord(recordOrData);
      }
      this.controller = new ko.sync.SyncController(model, this.record);
   };

   var Crud = ko.sync.Crud;


   /**
    * @param {Object} target
    * @param {ko.sync.Model} model
    * @param {ko.sync.Record|ko.sync.RecordList|Object} [dataRecOrList]
    * @static
    */
   Crud.applyTo = function( target, model, dataRecOrList) {
      if( ko.isObservable(target) && target.push ) {
         target.crud = new ko.sync.CrudArray(target, model, dataRecOrList);
      }
      else {
         target.crud = new ko.sync.Crud(target, model, dataRecOrList);
      }
   };

   /**
    * @param {boolean} [b] set the isDirty value (use this with care!)
    * @return {boolean}
    */
   Crud.prototype.isDirty = function(b) {
      return this.record.isDirty(b);
   };

   /**
    * Save a new record to the data layer
    * @return {ko.sync.Crud} this
    */
   Crud.prototype.create = function() {
      this.def = this.def.pipe(_.bind(function() {

         //todo
         //todo
         //todo

      }, this));
      return this;
   };

   /**
    * Load a record from the data layer into the local copy
    * @param {ko.sync.RecordId|string} recordId
    * @return {ko.sync.Crud} this
    */
   Crud.prototype.read = function( recordId ) {
      this.def = this.def.pipe(_.bind(function() {

         //todo
         //todo
         //todo

      }, this));
      return this;
   };

   /**
    * Push updates to the data layer
    * @return {ko.sync.Crud} this
    */
   Crud.prototype.update = function() {
      this.def = this.def.pipe(_.bind(function() {
         if( this.record.isDirty() ) {
            return this.controller.pushUpdates(this.record);
         }
         return this;
      }, this));
      return this;
   };

   /**
    * Delete record locally and from the data layer service
    * @return {ko.sync.Crud} this
    */
   Crud.prototype.delete = function() {
      //todo

      return this;
   };

   /**
    * Alias to the `update` method.
    * @return {ko.sync.Crud}
    */
   Crud.prototype.save = function() {
      return this.update();
   };

   /**
    * Alias to the `read` method.
    * @return {ko.sync.Crud}
    */
   Crud.prototype.load = function() {
      return this.read.apply(this, _.toArray(arguments));
   };

   /**
    * @return {jQuery.Deferred} promise
    */
   Crud.prototype.promise = function() {
      return this.def.promise();
   }

})(ko);

