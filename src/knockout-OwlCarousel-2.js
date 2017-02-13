
function Generator() {};
Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();
Generator.prototype.getId = function() { return 'uniqueID_' + this.rand++; };
var idGen = new Generator();


ko.bindingHandlers.addUniqueID = {
	init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		var uniqueID = idGen.getId();
		$(element).attr("id", uniqueID);
		valueAccessor()(uniqueID);
		$(`#${uniqueID}`).owlCarousel();
	}
};

// Use this until owl carousel fixes its destroy bug.
// It's not deleting all the classes it needs too.
function properlyDestroy($owlCarouselInstance) {
	$owlCarouselInstance = $(`#${self.containerID()}`);
	$owlCarouselInstance.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
	$owlCarouselInstance.find('.owl-stage-outer').children().unwrap();
}

$(document).ready(function(){
	
	var whateverVM = function() {
		var self = this;
		
		self.containerID = ko.observable("test");
		self.something = ko.observable("omgggggg");
		
        self.myItems = ko.observableArray([
			{
				uniqueItemID: ko.observable(idGen.getId()),
				name: "111111"
			},
			{
				uniqueItemID: ko.observable(idGen.getId()),
				name: "2222222222222"
			}
		]);
		
		// Currently only works with a single DOM element
		self.forEachRemove = function(domToRemove, indexToRemove, removedArrayElement) {
			if (domToRemove.nodeType === 3) {
				$owl = $(`#${self.containerID()}`);
				
				$itemToRemove = $owl.find("[data-id='" + removedArrayElement.uniqueItemID() + "']");
				if ($itemToRemove.length) { // item found
					var itemIndex = $itemToRemove.parent().index();
					
					$owl.trigger('remove.owl.carousel', itemIndex);
					$owl.trigger('refresh.owl.carousel');
				}
			}
		};
		
		self.clickEvent = function() {
			self.name = "test"; // as you can see bindings have been broken
			console.log("click event"); // but click events have already been bound. So they work
		};
		
		// Currently only works with a single DOM element
		self.afterAddTest = function(domAdding, itemIndex, addedArrayItem) {
			if (domAdding.nodeType === 3) {
				$owl = $(`#${self.containerID()}`);
				$owl.trigger('add.owl.carousel', [domAdding], itemIndex);
			}
		};
		
        self.addItem = function() {
			self.myItems.push({
				uniqueItemID: ko.observable(idGen.getId()),
				name: "new item"
			});
			
			// destroy the carousel and recreate it. Very inefficient
			$owl = $(`#${self.containerID()}`);
			properlyDestroy($owl);
			$owl.owlCarousel();
		};
		
        self.removeItem = function() {
			self.myItems.pop();
			
			// knockout isn't calling beforeRemove on the last item. We will do it manually
			if (self.myItems().length === 0) {
				$owl = $(`#${self.containerID()}`);
				$owl.trigger('remove.owl.carousel', 0);
				$owl.trigger('refresh.owl.carousel');
			}
		};
		
	}
	
    ko.applyBindings(whateverVM, document.getElementById("test"));
});