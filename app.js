// Storage Controller
const StorageCtrl = (function () {
    // Public methods
    return {
        storeItem: function(item) {
            let items = [];
            // Check if any items in local storage
            if(localStorage.getItem('items') !== null) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            // Push new item
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(idDeletion) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if(idDeletion === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        },
        getItemsFromStorage: function () {
            let items = [];
            if(localStorage.getItem('items') !== null) {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})()

// Item Controller
const ItemCtrl = (function(StorageCtrl){
    // Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let id = 0;
            // Create Id
            if(data.items.length > 0) {
                id = data.items[data.items.length -1].id + 1;
            }

            // Parse calories to number
            const cals = parseInt(calories);

            const newItem = new Item(id, name, cals);

            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function (item) {
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },
        getItemById: function(id){
            return data.items.find(item => item.id === id);
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(itemId) {
            // Get ids
            const ids = data.items.map(item => item.id);

            // Get index
            const index = ids.indexOf(itemId);

            // Remove from array
            data.items.splice(index, 1);

        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(currentItem) {
            data.currentItem = currentItem;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        logData: function() {
            return data;
        }
    }

})(StorageCtrl);

// UI Controller
const UICtrl = (function(){

    //  UI Selectors
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        listItems: '#item-list li',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn',
        itemCaloriesInput: '#item-calories'
    }

    // Public methods
    return {
        populateItemList:function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li id="item-${item.id}" class="collection-item">
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>
               `;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            // Insert li into the dom
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `
                            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
                }
            })

        } ,
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Transform NodeList to array
            listItems = Array.from(listItems);
            listItems.forEach(item => item.remove());
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // GEt UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress',  function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                event.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',  itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',  itemUpdateSubmit);

        // Back button event (clear currentItem
        document.querySelector(UISelectors.backBtn).addEventListener('click',  function(event){
            event.preventDefault();
            UICtrl.clearEditState();
        });

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',  itemDeleteSubmit);

        // Clear all item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',  clearAllItemsClick);
    }

    // Click edit item
    const itemAddSubmit = function (event) {
        event.preventDefault();
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== '') {
            // Add item to state
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to the UI
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Set value in the UI
            UICtrl.showTotalCalories(totalCalories);

            // Store to local storage
            StorageCtrl.storeItem(newItem);

            // Clear form fields
            UICtrl.clearInput();
        }
    }

    // Update item submit
    const itemEditClick = function(event) {
        event.preventDefault();
        if(event.target.classList.contains('edit-item')) {
            // Get list item id (item-1, item-2, ...)
            const listId = event.target.parentNode.parentNode.id;
            // Get number fragment as an actual number
            const id = +listId.split('-')[1];

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set item to edit
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();

        }
    }

    // Update Item submit
    const itemUpdateSubmit = function(event) {
        event.preventDefault();
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update the UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Set value in the UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        // Clear form fields
        UICtrl.clearEditState();

    }

    const itemDeleteSubmit = function(event) {
        event.preventDefault();

        // Get current itemId
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from state
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Set value in the UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Clear form fields
        UICtrl.clearEditState();

    }

    const clearAllItemsClick = function (event) {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Set value in the UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear from storage
        StorageCtrl.clearItemsFromStorage();

        // Clear form fields
        UICtrl.clearEditState();

        // Hide list
        UICtrl.hideList();

    }


    // Public methods
    return {

        init: function () {
            // Set initial state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Set value in the UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();