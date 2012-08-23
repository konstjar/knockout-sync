
(function(ko) {
   "use strict";

   /**
    * @param {Object} target a mapped observable array
    * @param {ko.sync.Model} model
    * @param {boolean} [startDirty]
    * @constructor
    */
   ko.sync.Crud = function(target, model, startDirty) {
      this.isDirty = ko.observable(startDirty||false);
      this.checkpoint = ko.mapping.toJSON(target);
      this.model = model;
      //todo deal with auto-updates
      //todo monitor for changes
   };

   var Crud = ko.sync.Crud;
   $.extend(Crud.prototype, {
      isDirty: function() {
         //todo
      },

      create: function() {
         //todo

         return this;
      },

      read: function( recordId ) {
         //todo

         return this;
      },

      update: function() {
         //todo

         return this;
      },

      delete: function() {
         //todo

         return this;
      },

      save: function() {
         return this.update();
      },

      load: function() {
         return this.read.apply(this, _.toArray(arguments));
      },

      promise: $.Deferred().resolve(null).promise()
   });

   /**
    * @param {Object} target a mapped observable array
    * @param {ko.sync.Model} model
    * @param {boolean} [startDirty]
    * @constructor
    */
   ko.sync.CrudArray = function(target, model, startDirty) {
      this.isDirty = ko.observable(startDirty||false);
      //todo not a good solution for arrays
      //todo does not account for persist/observe attributes of the model
      this.checkpoint = ko.mapping.toJSON(target);
      this.model = model;
      //todo deal with auto-updates
   };

   var CrudArray = ko.sync.CrudArray;
   $.extend(CrudArray.prototype, {
      isDirty: function() {
         //todo
      },

      create: function( data ) {
         //todo

         return this;
      },

      read: function( criteria ) {
         //todo

         return this;
      },

      update: function() {
         //todo

         return this;
      },

      delete: function( hashKey ) {
         //todo

         return this;
      },

      save: function() {
         return this.update();
      },

      load: function() {
         return this.read.apply(this, _.toArray(arguments));
      },

      promise: $.Deferred().resolve(null).promise()
   });

   CrudArray.applyTo = function( target, model, startDirty ) {
      if( ko.isObservable(target) && target.push ) {
         target.crud = new ko.sync.CrudArray(target, model, startDirty);
      }
      else {
         target.crud = new ko.sync.Crud(target, model, startDirty);
      }
      target.crud.parent = target;
   };

})(ko);
