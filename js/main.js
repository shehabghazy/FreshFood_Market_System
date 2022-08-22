"use strict"


// ----------------------------------------------------------------------------------------------
// Check Local Storage For FreshFood Producrs ---------------------------------------------------
let foodList = []
let preparaToSaveInStorage;
let preparaToGetFromStorage;

if (localStorage.getItem('FreshFood Products') != null ) {
    preparaToGetFromStorage = JSON.parse( localStorage.getItem('FreshFood Products') )
    foodList = preparaToGetFromStorage
}
else {
    foodList = [
        { itemId : '0' , foodType : 'Apple' , foodPhotoSrc : "Apple.jpg" , foodPrice : 4 } ,
        { itemId : '1' , foodType : 'Banana' , foodPhotoSrc : "Banana.jpg" , foodPrice : 3.4 } ,
        { itemId : '2' , foodType : 'Onion' , foodPhotoSrc : "Onion.jpg" , foodPrice : 1.5 } ,
        { itemId : '3' , foodType : 'Limon' , foodPhotoSrc : "Limon.jpg" , foodPrice : 9.5 } ,
        { itemId : '4' , foodType : 'Orange' , foodPhotoSrc : "Orange.jpg" , foodPrice : 7.65 } ,
        { itemId : '5' , foodType : 'Potatos' , foodPhotoSrc : "Potatos.jpg" , foodPrice : 8.25 } ,
        { itemId : '6' , foodType : 'Tomatoes' , foodPhotoSrc : "Tomatoes.jpg" , foodPrice : 2.19 } ,
        { itemId : '7' , foodType : 'Spinach' , foodPhotoSrc : "Spinach.jpg" , foodPrice : 5.99 } ,
        { itemId : '8' , foodType : 'Grapes' , foodPhotoSrc : "Grapes.jpg" , foodPrice : 5.55 } ,
        { itemId : '9' , foodType : 'Pepper' , foodPhotoSrc : "Pepper.jpg" , foodPrice : 2 } ,
    ]
}

// ----------------------------------------------------------------------------------------------
// Check Local Storage For Fatura Archieve ------------------------------------------------------
let faturaArchieve = []
let faturaIndex = 0;
let preparaToSaveFaturaInStorage;
let preparaToGetFaturaFromStorage;

if (localStorage.getItem('Fatura Archieve') != null ) {
    preparaToGetFaturaFromStorage = JSON.parse( localStorage.getItem('Fatura Archieve') )
    faturaArchieve = preparaToGetFaturaFromStorage
    faturaIndex = faturaArchieve.length
}

// ----------------------------------------------------------------------------------------------
// Main Section ---------------------------------------------------------------------------------
const displayFoodType = document.getElementById('displayFoodType');
const displayFoodPrice = document.getElementById('displayFoodPrice');
const displayFoodphoto = document.getElementById('displayFoodphoto');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const quantityContainer = document.getElementById('quantityContainer');
const displayTotalPrice = document.getElementById('displayTotalPrice');
const idSearchBtn = document.getElementById('idSearchBtn')
const idSearchInput = document.getElementById('idSearchInput')
const addToPackageBtn = document.getElementById('addToPackageBtn');
const packageContainer = document.getElementById('packageContainer');
const costBeforeDiscContainer = document.getElementById('costBeforeDiscContainer')
const costAfterDiscContainer = document.getElementById('costAfterDiscContainer')
const discContainer = document.getElementById('discContainer')
const idSearchError = document.getElementById('idSearchError')
const addToPackageError = document.getElementById('addToPackageError')
const openUpdateSectionError = document.getElementById('openUpdateSectionError')
const openDeleteSectionError = document.getElementById('openDeleteSectionError')

let selectedFoodPrice;
let selectedQuantityPrice = 0;
let defaultQuantity = 0;
quantityContainer.innerHTML = defaultQuantity;
let selectedFood = {};
let cutomerCart = [];
let indexToCatchItem;
let totalBeforeDisc;
let discValue;
let totalAfterDisc;

function searchInFoodListh (){
    let casherSearch = idSearchInput.value
    let isAvailable = false ;
    if (casherSearch == '') {
        displayError('idSearch' , '* Please Enter Barecode')
    }
    else {
        for (const [idex , food] of foodList.entries()) {   
            if (food.itemId.toLowerCase() == casherSearch.toLowerCase()) {
                isAvailable = true
                idSearchError.classList.add('d-none')
                indexToCatchItem = idex
                displaySearchResult(food);
            }
        }
        if (!isAvailable) {
            // console.log('This ID is not available')
            displayError('idSearch' , '* This Barecode Is Not Available')
        }
    } 
}
idSearchInput.addEventListener('keyup' , function(e) { if (e.key == 'Enter') {searchInFoodListh ();}; })
idSearchBtn.addEventListener('click' , function() {searchInFoodListh();})

function displaySearchResult(getFood) {
    selectedFood = getFood
    displayFoodType.innerHTML = selectedFood.foodType
    selectedFoodPrice = selectedFood.foodPrice
    displayFoodPrice.innerHTML = `${selectedFoodPrice} $`
    displayFoodphoto.src = `images/food/${selectedFood.foodPhotoSrc}`
    defaultQuantity = 0;
    quantityContainer.innerHTML = defaultQuantity
    selectedQuantityPrice = 0;
    displayTotalPrice.innerHTML = `${selectedQuantityPrice} $`
    idSearchInput.value = ""
    addToPackageError.classList.add('d-none')
    openUpdateSectionError.innerHTML = "ready to update"
    openDeleteSectionError.innerHTML = "ready to delete"
    openUpdateSectionError.classList.add('d-none')
    openDeleteSectionError.classList.add('d-none')
}

function addToPackage (){
    if (defaultQuantity != 0 && displayFoodType.innerHTML != '') {
        let selectedFoodForCustomer = JSON.parse(JSON.stringify(selectedFood))
        selectedFoodForCustomer.customerQuantity = defaultQuantity
        selectedFoodForCustomer.QuantityPrice = selectedQuantityPrice
        cutomerCart.push(selectedFoodForCustomer)
        // console.log(cutomerCart)
        payBtnError.classList.add('d-none')
        getTotalToPay();
        displaycutomerCart();    
    } 
    else {
        if (displayFoodType.innerHTML == '') {
            displayError( 'addToPackage' , '* Enter The Food Please')

        }
        else if (defaultQuantity == 0 ) {
            displayError( 'addToPackage' , '* Enter The Quantity Please')

        }
    }
}
addToPackageBtn.addEventListener('click' , addToPackage )

function displaycutomerCart() {
    let fillPackageContainer = ""
    for (const [getIndex , Food] of cutomerCart.entries()) {  
        fillPackageContainer += `
        <tr>
            <td class="text-center fs-8 text-secondary fw-semibold align-middle" scope="row">${getIndex+1}.</td>
            <td>${Food.foodType}</td>
            <td class="text-center">${Food.foodPrice} $</td>
            <td class="text-center">${Food.customerQuantity}</td>
            <td class="text-center">${Food.QuantityPrice} $</td>
            <td class="text-center"><button class="btn btn-danger border-0 p-0 px-2" onclick="deleteFromPackage(${getIndex})"><i class="fa-solid fa-xmark"></i></button></td>
        </tr>`
    }
    packageContainer.innerHTML = fillPackageContainer
    if (packageContainer.innerHTML == "") {
        packageContainer.innerHTML =`
        <tr>
            <th class="text-center" scope="row"></th>
            <td>Waiting to fill the package..</td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
        </tr>`
        costBeforeDiscContainer.innerHTML = ""
        discContainer.innerHTML = ""
        costAfterDiscContainer.innerHTML = ""
    }
}

function deleteFromPackage(getDeletedFood) {
    cutomerCart.splice(getDeletedFood , 1)
    getTotalToPay();
    displaycutomerCart();
}

function getTotalToPay() {
    const DiscPercentage = 10;
    totalBeforeDisc = 0;
    for (const food of cutomerCart) {
        totalBeforeDisc += food.QuantityPrice
        totalBeforeDisc = Math.round( totalBeforeDisc * 100 ) /100
    }
    totalAfterDisc = Math.round( (totalBeforeDisc - (totalBeforeDisc * (DiscPercentage/100))) * 100 ) / 100;
    discValue = Math.round( (totalBeforeDisc - totalAfterDisc) * 100 ) / 100;
    costBeforeDiscContainer.innerHTML = `${totalBeforeDisc} $`
    discContainer.innerHTML = `- ${discValue} $`
    costAfterDiscContainer.innerHTML = `${totalAfterDisc} $`
}

function changeQuantity(getChange) {
    if (defaultQuantity == 0 && getChange == -1 || displayFoodType.innerHTML == '') {
        defaultQuantity = 0
    }
    else {
        defaultQuantity += getChange
        selectedQuantityPrice = Math.round( defaultQuantity * selectedFoodPrice * 100) / 100;
        quantityContainer.innerHTML = defaultQuantity
        displayTotalPrice.innerHTML = `${selectedQuantityPrice} $`
        addToPackageError.classList.add('d-none')
    }
}
increaseBtn.addEventListener('click', function(){changeQuantity(+1);});
decreaseBtn.addEventListener('click', function(){changeQuantity(-1);});

function displayError(errorFor , erorMsg) {
    switch (errorFor) {
        case 'idSearch':
            idSearchError.classList.remove('d-none')
            idSearchError.innerHTML = erorMsg     
            break;
        case 'addToPackage':
            addToPackageError.classList.remove('d-none')
            addToPackageError.innerHTML = erorMsg         
            break;
        case 'openUpdateSection':
            openDeleteSectionError.classList.add('d-none')
            openUpdateSectionError.classList.remove('d-none')
            openUpdateSectionError.innerHTML = erorMsg      
            break;
        case 'openDeleteSection':
            openUpdateSectionError.classList.add('d-none')
            openDeleteSectionError.classList.remove('d-none')
            openDeleteSectionError.innerHTML = erorMsg      
            break;
    }
}

function displayDefault (){
    displayFoodType.innerHTML = ""
    displayFoodPrice.innerHTML = "0 $"
    displayFoodphoto.src = "images/logo.png"
    defaultQuantity = 0;
    quantityContainer.innerHTML = defaultQuantity
    displayTotalPrice.innerHTML = "0 $"
    idSearchInput.value = ""
    addToPackageError.classList.add('d-none')
    openUpdateSectionError.classList.add('d-none')
    openDeleteSectionError.classList.add('d-none')
}

// ----------------------------------------------------------------------------------------------
// Display Products Section ---------------------------------------------------------------------
const openDisplayProductsSectionBtn = document.getElementById('openDisplayProductsSectionBtn')
const diplayProductsSection = document.getElementById('diplayProductsSection')
const closeDisplayProductsSectionBtn = document.getElementById('closeDisplayProductsSectionBtn')
const DisplayProductsSectionContainer = document.getElementById('DisplayProductsSectionContainer')

function displayFoodList() {

    let fillProductsSectionContainer = `` ; 
    for (let i = 0; i < foodList.length; i++) {
        fillProductsSectionContainer += `
        <tr>
            <td class="fs-8 text-center align-middle fw-semibold" scope="row">${i+1}.</td>
            <td class="text-center">${foodList[i].itemId}</td>
            <td>${foodList[i].foodType}</td>
            <td colspan="2">${foodList[i].foodPrice} $</td>
        </tr>`        
    }
    DisplayProductsSectionContainer.innerHTML = fillProductsSectionContainer
}

openDisplayProductsSectionBtn.addEventListener('click' , function(){
    diplayProductsSection.classList.remove('d-none')
    displayFoodList()
})

closeDisplayProductsSectionBtn.addEventListener('click' , function(){
    diplayProductsSection.classList.add('d-none')
})

// ----------------------------------------------------------------------------------------------
// Add Section ----------------------------------------------------------------------------------
const openAddSectionBtn = document.getElementById('openAddSectionBtn')
const addSection = document.getElementById('addSection');
const enterFoodId = document.getElementById('enterFoodId');
const enterFoodType = document.getElementById('enterFoodType');
const enterFoodPrice = document.getElementById('enterFoodPrice');
const enterFoodPhoto = document.getElementById('enterFoodPhoto');
const addToFoodListBtn = document.getElementById('addToFoodListBtn');
const closeAddSectionBtn = document.getElementById('closeAddSectionBtn');
const addSectionMsg = document.getElementById('addSectionMsg');
const ImgForAdd  = document.getElementById('ImgForAdd')

openAddSectionBtn.addEventListener('click' , function(){
    addSection.classList.remove('d-none')
})

let newItemPhotoSrc ;
function addToFoodList(){
    let isAvailable = false
    let createNewItem = {
        itemId : enterFoodId.value ,
        foodType : enterFoodType.value ,
        foodPhotoSrc : newItemPhotoSrc ,
        foodPrice : Number( enterFoodPrice.value)
    }
    for (const food of foodList) {
        if (createNewItem.itemId == food.itemId) {
            isAvailable = true;
            displayAddSectionMsg('This Barecode is Aready Reserved');
        }
    }
    if (!isAvailable) {
        if (createNewItem.itemId == '' || createNewItem.foodType == '' || createNewItem.foodPrice =='' || createNewItem.foodPhotoSrc == undefined) {
            displayAddSectionMsg('Please Fill All Inputs');
        }
        else {
            foodList.push(createNewItem);
            preparaToSaveInStorage = JSON.stringify(foodList)
            localStorage.setItem("FreshFood Products" , preparaToSaveInStorage)
            displayAddSectionMsg('Done');
            closeAddSectionBtn.innerHTML = "Close"
            enterFoodId.value = '';
            enterFoodType.value = '';
            enterFoodPhoto.value = '';
            enterFoodPrice.value = '';
            newItemPhotoSrc = undefined
        }
    }
}
addToFoodListBtn.addEventListener('click' , addToFoodList )

enterFoodPhoto.addEventListener('change' , function(e){
    // newItemPhotoSrc = URL.createObjectURL(e.target.files[0]);
    let PhotoName = e.target.files[0].name
    newItemPhotoSrc = `${PhotoName}`
    ImgForAdd.src = `images/food/${PhotoName}`
})

function displayAddSectionMsg(msg) {
    switch (msg) {
        case 'This Barecode is Aready Reserved':
        case 'Please Fill All Inputs':
            addSectionMsg.classList.add('alert-warning')
            addSectionMsg.classList.remove('alert-success')
            addSectionMsg.innerHTML = `${msg} <i class="fa-solid fa-circle-exclamation"></i>`
            break;
        case 'Done':
            addSectionMsg.classList.add('alert-success')
            addSectionMsg.classList.remove('alert-warning')
            addSectionMsg.innerHTML = `${msg} <i class="fa-solid fa-circle-check"></i>`
            break;;
    }
    addSectionMsg.classList.remove('d-none')
}

closeAddSectionBtn.addEventListener('click' , function () {
    addSectionMsg.classList.add('d-none')
    addSection.classList.add('d-none')
    closeAddSectionBtn.innerHTML = "Cancel"
    ImgForAdd.src = `images/photo1.jpg`
})

// ----------------------------------------------------------------------------------------------
// Update Section -------------------------------------------------------------------------------
const openUpdateSectionBtn = document.getElementById('openUpdateSectionBtn')
const updateSection = document.getElementById('updateSection')
const updateFoodId = document.getElementById('updateFoodId')
const updateFoodType = document.getElementById('updateFoodType')
const updateFoodPrice = document.getElementById('updateFoodPrice')
const updateFoodPhoto = document.getElementById('updateFoodPhoto')
const updateInFoodListBtn = document.getElementById('updateInFoodListBtn')
const closeUpdateSectionBtn = document.getElementById('closeUpdateSectionBtn')
const UpdateSectionMsg = document.getElementById('UpdateSectionMsg')
const ImgForUpdate = document.getElementById('ImgForUpdate')


openUpdateSectionBtn.addEventListener('click' , function(){
    if (openUpdateSectionError.innerHTML == "ready to update") {
        catchItemToUpdate()
        updateSection.classList.remove('d-none')        
    }
    else {
        displayError('openUpdateSection' , '* Choose The Food To Update Please')    
    }
})

function catchItemToUpdate() {
    selectedFood = foodList[indexToCatchItem]
    updateFoodId.value = selectedFood.itemId
    updateFoodType.value = selectedFood.foodType
    updateFoodPrice.value = selectedFood.foodPrice
    ImgForUpdate.src = `images/food/${selectedFood.foodPhotoSrc}`
}

function updateInFoodList() {
    let foodPhotoBeforeUpdate = selectedFood.foodPhotoSrc
    selectedFood.itemId = updateFoodId.value
    selectedFood.foodType = updateFoodType.value
    selectedFood.foodPrice = Number(updateFoodPrice.value)
    if (newItemPhotoSrc != foodPhotoBeforeUpdate && newItemPhotoSrc != undefined) {
        selectedFood.foodPhotoSrc = newItemPhotoSrc
    }
    closeUpdateSectionBtn.innerHTML = "Close"
    displaySearchResult(selectedFood) 
    preparaToSaveInStorage = JSON.stringify(foodList)
    localStorage.setItem("FreshFood Products" , preparaToSaveInStorage)
    displayUpdateSectionMsg('Done');
}
updateInFoodListBtn.addEventListener('click' , updateInFoodList )

updateFoodPhoto.addEventListener('change' , function(e){
    // newItemPhotoSrc = URL.createObjectURL(e.target.files[0]);
    let PhotoName = e.target.files[0].name
    newItemPhotoSrc = `${PhotoName}`
    ImgForUpdate.src = `images/food/${PhotoName}`
})

function displayUpdateSectionMsg(msg) {
    switch (msg) {
        case 'Done':
            UpdateSectionMsg.classList.add('alert-success')
            UpdateSectionMsg.classList.remove('alert-warning')
            UpdateSectionMsg.innerHTML = `${msg} <i class="fa-solid fa-circle-check"></i>`
            break;;
    }
    UpdateSectionMsg.classList.remove('d-none')
}

closeUpdateSectionBtn.addEventListener('click' , function () {
    UpdateSectionMsg.classList.add('d-none')
    updateSection.classList.add('d-none')
    closeUpdateSectionBtn.innerHTML = "Cancel"
    updateFoodPhoto.value = ""
})

// ----------------------------------------------------------------------------------------------
// Deletion Section -----------------------------------------------------------------------------
const deleteFromFoodListBtn = document.getElementById('deleteFromFoodListBtn')
const confirmDeletionSection = document.getElementById('confirmDeletionSection')
const DisplayChoosedFoodToDelete = document.getElementById('DisplayChoosedFoodToDelete')
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn')
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn')

deleteFromFoodListBtn.addEventListener('click' , function(){
    if (openDeleteSectionError.innerHTML == "ready to delete") {
        catchItemToDelete()
    }
    else {
        displayError('openDeleteSection' , '* Choose The Food To Delete Please')    
    }
})

function catchItemToDelete() {
    selectedFood = foodList[indexToCatchItem]
    DisplayChoosedFoodToDelete.innerHTML = selectedFood.foodType
    confirmDeletionSection.classList.remove('d-none')
}

confirmDeleteBtn.addEventListener('click' , function(){
    foodList.splice(indexToCatchItem , 1 )
    openDeleteSectionError.innerHTML = ""
    preparaToSaveInStorage = JSON.stringify(foodList)
    localStorage.setItem("FreshFood Products" , preparaToSaveInStorage)

    confirmDeletionSection.classList.add('d-none')
    displayDefault ();
})

cancelDeleteBtn.addEventListener('click' , function(){
    confirmDeletionSection.classList.add('d-none')
})

// ----------------------------------------------------------------------------------------------
// Fatura Section -------------------------------------------------------------------------------
const payBtn = document.getElementById('payBtn')
const payBtnError = document.getElementById('payBtnError')
const faturaSection = document.getElementById('faturaSection')
const saveFaturaBtn = document.getElementById('saveFaturaBtn')
const closeFaturaBtn = document.getElementById('closeFaturaBtn')
const printFaturaBtn = document.getElementById('printFaturaBtn')
const faturaContainer = document.getElementById('faturaContainer')
const faturaIndexContainer = document.getElementById('faturaIndexContainer')

let currentFatura = []

payBtn.addEventListener('click' , function(){
    if (cutomerCart.length != 0) {
        faturaSection.classList.remove('d-none')
        generateFatura()
        displayFatura()
    }
    else {
        payBtnError.classList.remove('d-none')
    }
})

function generateFatura(){
    faturaIndex += 1;
    currentFatura = [...cutomerCart]
    let currentFaturaId = {
        index : faturaIndex,
        BeforeDisc : totalBeforeDisc ,
        disc : discValue,
        AfterDisc : totalAfterDisc,
    }
    currentFatura.unshift(currentFaturaId)
}

function displayFatura(){
    let getFaturaForDisplay = ``
    for (let i = 1; i < currentFatura.length; i++) {
        getFaturaForDisplay += `
        <div class="row">
        <span class="col-2 text-end">${currentFatura[i].customerQuantity}</span>
        <span class="col-7 text-start">${currentFatura[i].foodType} * ${currentFatura[i].foodPrice} $</span>
        <span class="col-3 text-center">${currentFatura[i].QuantityPrice} $</span>
        </div>` 
    }
    getFaturaForDisplay += `
        <div class="row">
            <span class="col-12 text-center">- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
            <div class="container main-color">
                <div class="row">
                    <div class="col-6 fs-3 fw-semibold align-middle d-flex justify-content-center align-items-center">
                        <i class="fa-solid fa-seedling mx-3"></i>
                        FreshFood
                    </div>
                    <div class="col-6">
                        <div class="container">
                            <div class="row text-end">
                                <span class="col-7 fw-semibold">${currentFatura[0].BeforeDisc} $</span>
                                <span class="col-7 fw-semibold">- ${currentFatura[0].disc} $</span>
                                <span class="col-7 fw-semibold">${currentFatura[0].AfterDisc} $</span>        
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>`
    faturaContainer.innerHTML = getFaturaForDisplay
}

saveFaturaBtn.addEventListener('click' , function(){
    let isSaved = false;
    if (faturaArchieve.length != 0) {
        for (let i = 0; i < faturaArchieve.length; i++) {
            if (faturaIndex == faturaArchieve[i][0].index) {
                isSaved = true
            }         
        }
        if (!isSaved) {
            faturaArchieve.push(currentFatura)
            preparaToSaveFaturaInStorage = JSON.stringify(faturaArchieve)
            localStorage.setItem('Fatura Archieve' , preparaToSaveFaturaInStorage)
            closeFaturaBtn.innerHTML = "Close"
            displayFaturaSectionMsg('Fatura Has Been Saved')
        }
        else {
            displayFaturaSectionMsg('This Fatura Has Aready Saved')
        }
    }
    else {
        faturaArchieve.push(currentFatura)
        preparaToSaveFaturaInStorage = JSON.stringify(faturaArchieve)
        localStorage.setItem('Fatura Archieve' , preparaToSaveFaturaInStorage)
        closeFaturaBtn.innerHTML = "Close"
        displayFaturaSectionMsg('Fatura Has Been Saved')
    }
})

function displayFaturaSectionMsg(msg) {
    switch (msg) {
        case 'Fatura Has Been Saved':
            faturaSectionMsg.classList.add('alert-success')
            faturaSectionMsg.classList.remove('alert-warning')
            faturaSectionMsg.innerHTML = `${msg} <i class="fa-solid fa-circle-check"></i>`
            break;
        case 'This Fatura Has Aready Saved':
            faturaSectionMsg.classList.add('alert-warning')
            faturaSectionMsg.classList.remove('alert-success')
            faturaSectionMsg.innerHTML = `${msg} <i class="fa-solid fa-circle-exclamation"></i>`
            break;;
    }
    faturaSectionMsg.classList.remove('d-none')
}

closeFaturaBtn.addEventListener('click' , function(){
    faturaSection.classList.add('d-none')
    faturaSectionMsg.classList.add('d-none')
    if (closeFaturaBtn.innerHTML == "Cancel" && faturaIndex != 0) {
        faturaIndex -= 1;
        console.log(faturaIndex)
    }
    closeFaturaBtn.innerHTML = "Cancel"
})




