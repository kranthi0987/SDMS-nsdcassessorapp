/***********************************************************************************
 * App Services. This contains the logic of the application organised in modules/objects. *
 ***********************************************************************************/

myApp.services = {

  /////////////////
  // Task Service //
  /////////////////
  tasks: {

    // Creates a new task and attaches it to the pending task list.
    create: function(data) {
      // Task item template.
      var template = document.createElement('div');
      template.innerHTML =
        '<ons-list-item tappable category="' + myApp.services.categories.parseId(data.category)+ '">' +
          '<label class="left">' +
           '<ons-input type="checkbox"></ons-input>' +
          '</label>' +
          '<div class="center">' +
            data.title +
          '</div>' +
          '<div class="right">' +
            '<ons-icon style="color: grey; padding-left: 4px" icon="ion-ios-trash-outline, material:md-delete"></ons-icon>' +
          '</div>' +
        '</ons-list-item>'
      ;

      // Takes the actual task item.
      var taskItem = template.firstChild;
      // Store data within the element.
      taskItem.data = data;

      // Add 'completion' functionality when the checkbox changes.
      taskItem.data.onCheckboxChange = function(event) {
        myApp.services.animators.swipe(taskItem, function() {
          var listId = (taskItem.parentElement.id === 'pending-list' && event.target.checked) ? '#completed-list' : '#pending-list';
          document.querySelector(listId).appendChild(taskItem);
        });
      };

      taskItem.addEventListener('change', taskItem.data.onCheckboxChange);

      // Add button functionality to remove a task.
      taskItem.querySelector('.right').onclick = function() {
        myApp.services.tasks.remove(taskItem);
      };

      // Add functionality to push 'details_task.html' page with the current element as a parameter.
      taskItem.querySelector('.center').onclick = function() {
        document.querySelector('#myNavigator')
          .pushPage('html/details_task.html',
            {
              animation: 'lift',
              data: {
                element: taskItem
              }
            }
          );
      };

      // Check if it's necessary to create new categories for this item.
      myApp.services.categories.updateAdd(taskItem.data.category);

      // Add the highlight if necessary.
      if (taskItem.data.highlight) {
        taskItem.classList.add('highlight');
      }

      // Insert urgent tasks at the top and non urgent tasks at the bottom.
      var pendingList = document.querySelector('#pending-list');
      pendingList.insertBefore(taskItem, taskItem.data.urgent ? pendingList.firstChild : null);
    },

    // Modifies the inner data and current view of an existing task.
    update: function(taskItem, data) {
      if (data.title !== taskItem.data.title) {
        // Update title view.
        taskItem.querySelector('.center').innerHTML = data.title;
      }

      if (data.category !== taskItem.data.category) {
        // Modify the item before updating categories.
        taskItem.setAttribute('category', myApp.services.categories.parseId(data.category));
        // Check if it's necessary to create new categories.
        myApp.services.categories.updateAdd(data.category);
        // Check if it's necessary to remove empty categories.
        myApp.services.categories.updateRemove(taskItem.data.category);

      }

      // Add or remove the highlight.
      taskItem.classList[data.highlight ? 'add' : 'remove']('highlight');

      // Store the new data within the element.
      taskItem.data = data;
    },

    // Deletes a task item and its listeners.
    remove: function(taskItem) {
      taskItem.removeEventListener('change', taskItem.data.onCheckboxChange);

      myApp.services.animators.remove(taskItem, function() {
        // Remove the item before updating the categories.
        taskItem.remove();
        // Check if the category has no items and remove it in that case.
        myApp.services.categories.updateRemove(taskItem.data.category);
      });
    }
  },

  /////////////////////
  // Category Service //
  ////////////////////
  categories: {

    // Creates a new category and attaches it to the custom category list.
    create: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);

      // Category item template.
      var template = document.createElement('div');
      template.innerHTML =
        '<ons-list-item tappable category-id="' + categoryId + '">' +
          '<div class="left">' +
            '<ons-input type="radio" name="categoryGroup" input-id="radio-'  + categoryId + '"></ons-input>' +
          '</div>' +
          '<label class="center" for="radio-' + categoryId + '">' +
            (categoryLabel || 'No category') +
          '</label>' +
        '</ons-list-item>'
      ;

      // Takes the actual category item.
      var categoryItem = template.firstChild;

      // Adds filtering functionality to this category item.
      myApp.services.categories.bindOnCheckboxChange(categoryItem);

      // Attach the new category to the corresponding list.
      document.querySelector('#custom-category-list').appendChild(categoryItem);
    },

    // On task creation/update, updates the category list adding new categories if needed.
    updateAdd: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryItem = document.querySelector('#menuPage ons-list-item[category-id="' + categoryId + '"]');

      if (!categoryItem) {
        // If the category doesn't exist already, create it.
        myApp.services.categories.create(categoryLabel);
      }
    },

    // On task deletion/update, updates the category list removing categories without tasks if needed.
    updateRemove: function(categoryLabel) {
      var categoryId = myApp.services.categories.parseId(categoryLabel);
      var categoryItem = document.querySelector('#tabbarPage ons-list-item[category="' + categoryId + '"]');

      if (!categoryItem) {
        // If there are no tasks under this category, remove it.
        myApp.services.categories.remove(document.querySelector('#custom-category-list ons-list-item[category-id="' + categoryId + '"]'));
      }
    },

    // Deletes a category item and its listeners.
    remove: function(categoryItem) {
      if (categoryItem) {
        // Remove listeners and the item itself.
        categoryItem.removeEventListener('change', categoryItem.updateCategoryView);
        categoryItem.remove();
      }
    },

    // Adds filtering functionality to a category item.
    bindOnCheckboxChange: function(categoryItem) {
      //var categoryId = categoryItem.getAttribute('category-id');
      //var allItems = categoryId === null;

      //categoryItem.updateCategoryView = function() {
      //  var query = '[category="' + (categoryId || '') + '"]';

      //  var taskItems = document.querySelectorAll('#tabbarPage ons-list-item');
      //  for (var i = 0; i < taskItems.length; i++) {
      //    taskItems[i].style.display = (allItems || taskItems[i].getAttribute('category') === categoryId) ? '' : 'none';
      //  }
      //};

      //categoryItem.addEventListener('change', categoryItem.updateCategoryView);
    },

    // Transforms a category name into a valid id.
    parseId: function(categoryLabel) {
      return categoryLabel ? categoryLabel.replace(/\s\s+/g, ' ').toLowerCase() : '';
    }
  },

  //////////////////////
  // Animation Service //
  /////////////////////
  animators: {

    // Swipe animation for task completion.
    swipe: function(listItem, callback) {
      var animation = (listItem.parentElement.id === 'pending-list') ? 'animation-swipe-right' : 'animation-swipe-left';
      listItem.classList.add('hide-children');
      listItem.classList.add(animation);

      setTimeout(function() {
        listItem.classList.remove(animation);
        listItem.classList.remove('hide-children');
        callback();
      }, 950);
    },

    // Remove animation for task deletion.
    remove: function(listItem, callback) {
      listItem.classList.add('animation-remove');
      listItem.classList.add('hide-children');

      setTimeout(function() {
        callback();
      }, 750);
    }
  },

  ////////////////////////
  // Initial Data Service //
  ////////////////////////
  fixtures: [
    {
      title: 'Download OnsenUI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Install Monaca CLI',
      category: 'Programming',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Star Onsen UI repo on Github',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Register in the community forum',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Send donations to Fran and Andreas',
      category: 'Super important',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Profit',
      category: '',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Visit Japan',
      category: 'Travels',
      description: 'Some description.',
      highlight: false,
      urgent: false
    },
    {
      title: 'Enjoy an Onsen with Onsen UI team',
      category: 'Personal',
      description: 'Some description.',
      highlight: false,
      urgent: false
    }
  ],
    
	frameFormJson:  function(page){
		var formJson = {};
		formJson["username"] = page.querySelector('#userName-input').value;
		formJson["password"] = page.querySelector('#password-input').value;
		formJson["fStation"] = page.querySelector("input#fromStation").value;
		formJson["tStation"] = page.querySelector("input#toStation").value;
		formJson["date"] = page.querySelector('[placeholder="Journey date"]').value;
//		formJson["ticketType"] = page.querySelector("#ticketType").val();
//		/*if(yes("#handicapPassengers:checked").length > 0) {
//			formJson["handicapPassengers"] = true;
//		} else {
//			formJson["handicapPassengers"] = false;
//		}*/
//		formJson["handicapPassengers"] = isCheckBoxSelected("#handicapPassengers:checked");
		formJson["trainNum"] = page.querySelector('[component="trainNumber"]').value
//		formJson["quota"] = page.querySelector('input[name=quotaRadioOptions]:checked').value;
		formJson["class"] = page.querySelector('[component="class"]').value;
//		formJson["passengerDetails"] = getPassengerDetailsJson();
//		formJson["childrenDetails"] = getChildrenDetailsJson();
//		formJson["considerAutoUpgradation"] = isCheckBoxSelected('input[id=considerAutoUpgradation]:checked');//getConsiderAutoUpgradation();
//		formJson["bookIfConfirmBerths"] = isCheckBoxSelected('input[id=bookIfConfirmBerths]:checked');//getBookIfConfirmBerths();
//		formJson["mobile"] = page.querySelector('#mobile').value;
//		formJson["paymentDetails"] = getPaymentDetailsJson();
		return formJson;
	},
    
    
	// save the current form, both new and existing forms are handled here.
	saveForm: function(page){
		var currentForm = myApp.services.frameFormJson(page);
		var existingData = localStorage["YESDATA"];
		if( existingData === undefined)
		{
			existingData = [];
			existingData[0] = currentForm;
		} else {
			existingData = JSON.parse(existingData);
			var currentCounter = 0;
			if(localStorage["YV_editIndicator"] == "true"){
				localStorage["YV_editIndicator"] = "false";
				currentCounter = parseInt(localStorage["YV_editCount"]);
			} else {
				try {
					currentCounter = existingData.length; 
				} catch(err) {
					currentCounter = 0;
				}
				localStorage["YV_editCount"] = currentCounter;
			}
			existingData[currentCounter] = currentForm;
		}
        myApp.services.saveExistingData(existingData);
		return true;
	},
    
    saveExistingData: function(data) {
		localStorage["YESDATA"] = JSON.stringify(data); 
        console.log(localStorage["YESDATA"]);
	},
    
    frameExistingForms: function(){
        var existingData = {};
		try {
			existingData = JSON.parse(localStorage["YESDATA"]);
		}
		catch(err) {
			
		}
        if(existingData.length > 0) {
            existingData.forEach(function(currentForm){
                var template = document.createElement('div');
                template.innerHTML =
                    '<ons-list-item>' +
                      '<div class="head"><div class="dateCont">' +
                        '<p class="date">05</p>' +
                        '<p class="Month">Jun</p>' +
                      '</div>' +
                      '<div class="center">' +
                        '<span class="list__item__title">1024 trin</span>' +
                        '<span class="from">TPTY - Tirupathi</span>' +
                        '<span class="to">CHN - Chennai</span>' +
                      '</div></div> <div class="footer">' +
                        '<ons-button modifier="quiet"><i class="fa fa-pencil-square-o" aria-hidden="true"></i> Edit</ons-button><ons-button modifier="quiet"><i class="fa fa-ticket" aria-hidden="true"></i> Book</ons-button>' +
                      '</div>' +
                    '</ons-list-item>';


                var taskItem = template.firstChild;
                // Store data within the element.
                //taskItem.data = currentForm;
                // Insert urgent tasks at the top and non urgent tasks at the bottom.
                var savedFormsList = document.querySelector('#saved-forms-list');
                savedFormsList.insertBefore(taskItem, savedFormsList.firstChild);
            });
        } else {
            console.log("existingData in undefined"); 
        }
      
    }
    
    
    
    
};