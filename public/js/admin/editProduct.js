/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const updateProductForm = document.getElementById('update-product');
const feedbackText = document.getElementById('feedback-text');
const header = document.getElementById('update-header');

// - Product Images
const uploadImageButton = document.getElementById('upload-image');
const productImage = document.getElementById('product-image');

// - Products
const categoryDropdown = document.getElementById('category-dropdown');
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');

// - Variations
const variationsWrapper = document.getElementById('variations-wrapper');
const variationName = document.getElementById('variation-name');
const variationStock = document.getElementById('variation-stock');
const colorPicker = document.getElementById('color-picker');
const addVariation = document.getElementById('add-variation');

// - Images
const imagesWrapper = document.getElementById('images-wrapper');

// - Update
const updateButton = document.getElementById('update-button');
const deleteButton = document.getElementById('delete-button');

/***********************************************
                    VARIABLES                   
***********************************************/
var originalImageArray = [];
var originalVariationsArray = [];
var imageArray = [];
var variationsArray = []; 
var parsedProduct;

/***********************************************
                 FETCH REQUESTS             
***********************************************/
async function fetchPost( URL, formData ) {
    var response = await fetch( URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( formData ),
    }); 
    return response;
}

/** 
    ` It parses the product data from a JSON string and returns it as
    an array of objects. This is required so we can iterate through an
    object retrieved from a fetch request properly.
*/
function parseObject( object ) {
    return JSON.parse( object );
}

/***********************************************
                 DOM CONTENT LOAD            
***********************************************/
document.addEventListener('DOMContentLoaded', () => {
    try {
        initVariables();
        loadData();
        loadImages();
        loadVariations();

    } catch( error ) {
        console.log( error );
    }
});

function initVariables() {
    originalImageArray = parseObject( images );
    originalVariationsArray = parseObject( variations );
    imageArray = parseObject( images );
    variationsArray = parseObject( variations );
    parsedProduct = parseObject( product );
}

function loadData() {
    productName.value = parsedProduct.productName;
    productPrice.value = parsedProduct.price;
    productDescription.textContent = parsedProduct.productDescription;

    const firstVariation = variationsArray[0];
    variationName.value = firstVariation.variationName;
    colorPicker.value = firstVariation.hexColor;
    variationStock.value = firstVariation.stockQuantity;

}

function loadImages() {
    for( let i = 0; i < imageArray.length; i++ ) {
        const image = imageArray[i];
        const imageSource = image.filePath;
        const imageName = image.originalName;
    
        //: [1] image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
    
        //: [2] image display
        const itemImage = document.createElement('div');
        itemImage.className = 'item-image';
        itemImage.innerHTML = `
            <div class = "item-icon-col">
                <img class = "item-icon" src = "${imageSource}"> 
            </div>
            <div class = "item-name">${imageName}</div> 
        `;
    
        //: [3] image delete button
        const removeImageContainer = document.createElement('div');
        removeImageContainer.className = 'remove-container';
    
        const removeImageButton = document.createElement('button');
        removeImageButton.type = 'button';
        removeImageButton.className = 'remove-button';
        removeImageButton.textContent = '-';
    
        //: [3] remove variation-container when button clicked
        removeImageButton.addEventListener( 'click', function() {
            imageContainer.remove();
            const index = imageDetails.indexOf(image);
            if( index >= 0 ) {
                imageDetails.splice( index, 1 );
            }
        });
    
        removeImageContainer.appendChild(removeImageButton);
        itemImage.appendChild(removeImageContainer);
        imageContainer.appendChild(itemImage);
        imagesWrapper.appendChild(imageContainer);


    }
}

function loadVariations() {
    for( let i = 0; i < variationsArray.length; i++ ) {
        const name = variationsArray[i].variationName;
        const color = variationsArray[i].hexColor;
        const stock = variationsArray[i].stockQuantity;
        const variationsID = variationsArray[i].variationsID;

        //: [1] variation container
        const variationContainer = document.createElement('div');
        variationContainer.className = 'variation-container';
    
        variationContainer.innerHTML = `
            <div class = "variation-label" value = "${name}"> ${name} </div> 
            <div class = "input-box">
                <div class = "color-value" style = "background-color: ${color};" value = "${color}"> </div> 
            </div>
            <div class = "variation-label"> STOCK </div>
            <div class = "input-box">
                <input type = "number" class = "stock-value" step = "1" min = "0" value = "${stock}" readonly>
            </div>
        `;
    
        //: [2] remove button container
        const removeVariationContainer = document.createElement('div');
        removeVariationContainer.className = 'remove-container';
    
        const removeVariationsButton = document.createElement('button');
        removeVariationsButton.type = 'button';
        removeVariationsButton.className = 'remove-button';
        removeVariationsButton.textContent = '-';
    
        //: [3] remove variation-container when button clicked
        removeVariationsButton.addEventListener( 'click', function() {
            variationContainer.remove();
            variationsArray.splice( i, 1 );
        });
    
        //: [4] append to 'variations-wrapper'
        removeVariationContainer.appendChild(removeVariationsButton);
        variationContainer.appendChild(removeVariationContainer);
        variationsWrapper.appendChild(variationContainer);
    }
}

/***********************************************
         IMAGE AND VARIATIONS COMPARISON            
***********************************************/

/***********************************************
             UPDATE PRODUCT BUTTON            
***********************************************/
updateButton.addEventListener('click', async function (e) {
    e.preventDefault(); 

    try {
        // - Get the form data     
        const productID = parseObject(product).productID;       
        const categoryDropdown = document.getElementById('category-dropdown');
        const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
        const categoryID = selectedOption.getAttribute('data-id');
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description').value;

        // - Validate input fields
        const areInputsValid = validateInputFields();
        if( !areInputsValid.status ) {
            feedbackText.className = "feedback error"
            feedbackText.textContent = areInputsValid.message;
            return false;
        }
        
        const formData = {
            productID: productID,
            productName: name,
            price: price,
            productDescription: description,
            categoryID: categoryID
        }

        const response = await fetch('/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData ),
        });

        if( response.status == 200 ) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

            feedbackText.className = "feedback success";
            feedbackText.textContent = "Product (ID#" + productID + ") " + name +  " updated on " + formattedDate;
        } else if( response.status == 500 ) {
            feedbackText.textContent = response.message;
        }
    } catch( error ) {
        console.log( error );
    }
});

/**
    ` Retrieves the product details from the input fields of product registration form.
    @returns {Object} where { 'name', 'price', 'description', 'stock', 'categoryID' }
*/
function getProductFormData() {

    const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
    const categoryID = selectedOption.getAttribute('data-id');
    const name = productName.value;
    const price = parseFloat(productPrice.value);
    const description = productDescription.value;

    const formData = {
        name: name,
        price: price,
        description: description,
        categoryID: categoryID
    };

    return formData;
}

/***********************************************
                PRODUCT VARIATIONS            
***********************************************/
/**
    ` When the add variation button is clicked, this function: 
        1. Validate the input fields
        2. Display appropriate feedback messages
        3. Generates the HMTL for the new variation
        4. Stores the details inside the 'variation' array
*/
addVariation.addEventListener('click', async function (e) { 
    const areInputFieldsValid = validateInputFields();
    if( !areInputFieldsValid.status ) {
        feedbackText.className = "feedback error";
        feedbackText.textContent = areInputFieldsValid.message;
        header.style.paddingTop = "20px";
        return;
    } 

    try {
        const variationFormData = getVariationFormData();
        variations.push(variationFormData);
        generateVariationHTML(variationFormData);
    } catch( error ) {
        console.log( error );
    }
});

/**
    ` This function generates the HTML structure for a product variation
    and adds it to 'variations-wrapper'. 
    
    NOTE: Please refer to the EJS file to view the HTML structure for the
    variations, which have been commented out for reference.
*/
function generateVariationHTML( variationData ) {
    const name = variationName.value;
    const color = colorPicker.value;
    const stock = variationStock.value;

    //: [1] variation container
    const variationContainer = document.createElement('div');
    variationContainer.className = 'variation-container';

    variationContainer.innerHTML = `
        <div class = "variation-label" value = "${name}"> ${name} </div> 
        <div class = "input-box">
            <div class = "color-value" style = "background-color: ${color};" value = "${color}"> </div> 
        </div>
        <div class = "variation-label"> STOCK </div>
        <div class = "input-box">
            <input type = "number" class = "stock-value" step = "1" min = "0" value = "${stock}" readonly>
        </div>
    `;

    //: [2] remove button container
    const removeVariationContainer = document.createElement('div');
    removeVariationContainer.className = 'remove-container';

    const removeVariationsButton = document.createElement('button');
    removeVariationsButton.type = 'button';
    removeVariationsButton.className = 'remove-button';
    removeVariationsButton.textContent = '-';

    //: [3] remove variation-container when button clicked
    removeVariationsButton.addEventListener( 'click', function() {
        variationContainer.remove();
        const index = variations.indexOf(variationData);
        if( index >= 0 ) {
            variations.splice( index, 1 );
        }
    });

    //: [4] append to 'variations-wrapper'
    removeVariationContainer.appendChild(removeVariationsButton);
    variationContainer.appendChild(removeVariationContainer);
    variationsWrapper.appendChild(variationContainer);
}

/**
    ` Retrieves the product details from the input fields of product registration form.
    @returns {Object} where { 'name', 'color', 'stock' }
*/
function getVariationFormData() {
    const name = variationName.value;
    const color = colorPicker.value;
    const stock = variationStock.value;

    const formData = {
        name: name,
        color: color,
        stock: stock
    };

    return formData;
}

/***********************************************
            UPLOAD PRODUCT IMAGE BUTTON            
***********************************************/
uploadImageButton.addEventListener('change', async function() {
    try {
        // - Check if there's an uploaded file
        const selectedFile = this.files[0];
        if( selectedFile ) {
            const formData = new FormData();
            formData.append( 'product', selectedFile );

            const response = await fetch('/uploadTemporaryImage', {
                method: "POST",
                body: formData
            })

            if( response.status !== 200 ) {
                console.error( "Error uploading file" );
                return;
            }

            // - Get image details
            const data = await response.json();
            const { image } = data;
            imageDetails.push( image );
            generateImageHTML( image );
        }
    } catch( error ) {
        console.log( "uploadImageButton: ", error );
    }
});

/**
    ` This function generates the HTML structure for a product variation
    and adds it to 'images-wrapper'. 
    
    NOTE: Please refer to the EJS file to view the HTML structure for the 
    product images, which have been commented out for reference.
*/
function generateImageHTML( image ) {

    const imageSource = image.filePath;
    const imageName = image.originalName

    //: [1] image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    //: [2] image display
    const itemImage = document.createElement('div');
    itemImage.className = 'item-image';
    itemImage.innerHTML = `
        <div class = "item-icon-col">
            <img class = "item-icon" src = "${imageSource}"> 
        </div>
        <div class = "item-name">${imageName}</div> 
    `;

    //: [3] image delete button
    const removeImageContainer = document.createElement('div');
    removeImageContainer.className = 'remove-container';

    const removeImageButton = document.createElement('button');
    removeImageButton.type = 'button';
    removeImageButton.className = 'remove-button';
    removeImageButton.textContent = '-';

    //: [3] remove variation-container when button clicked
    removeImageButton.addEventListener( 'click', function() {
        imageContainer.remove();
        const index = imageDetails.indexOf(image);
        if( index >= 0 ) {
            imageDetails.splice( index, 1 );
        }
    });

    removeImageContainer.appendChild(removeImageButton);
    itemImage.appendChild(removeImageContainer);
    imageContainer.appendChild(itemImage);
    imagesWrapper.appendChild(imageContainer);
}

/***********************************************
                INPUT VALIDATION            
***********************************************/
/**
    ` Validate the input fields for product registration.
    @returns {Object} where { 'status' as boolean, 'message' as error response }
*/
function validateInputFields() {
    const newProductName = productName.value;
    const newProductPrice = productPrice.value; 
    const newVariationName = variationName.value;
    const newVariationStock = variationStock.value; 
    const newVariationColor = colorPicker.value;

    if( !newProductName ) {
        return { status: false, message: "Error! Product name is missing." };
    } else if( !newProductPrice ) {
        return { status: false, message: "Error! Product price is missing." };
    } else if( !newVariationName ) {
        return { status: false, message: "Error! Product variation name is missing." };
    } else if( !newVariationStock ) {
        return { status: false, message: "Error! Product variation stock is missing." };
    } else if( !newVariationColor ) {
        return { status: false, message: "Error! Product variation color is missing." };
    } else {
        return { status: true };
    }
}

async function resetInputFields() {
    imageDetails = [];
    variations = [];
    variationsWrapper.innerHTML = '';
    imagesWrapper.innerHTML = '';
    productName.value = '';
    productPrice.value = '';
    productDescription.value = '';
    variationName.value = '';
    variationStock.value = '';
    colorPicker.value = '#FFFFFF';
}

/***********************************************
                  DELETE BUTTON                   
***********************************************/
deleteButton.addEventListener('click', async function(e) {
    try {
        var modal = createConfirmationPopup();
        modal.classList.add('active');
    } catch( error ) {
        console.log( error );
    }
});

async function deleteProduct( product ) {
    try {
        const response = await fetch( 'deleteProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: product
        });

        if( response.status == 201 ) {
            window.location.href = "/inventory";
        } else {
            switch( response.status ) {
                case 404: {
                    feedbackText.textContent = 'Product not found';
                } break;
                case 500: {
                    feedbackText.textContent = 'Internal server error';
                }
            }
        }
    } catch( error ) {
        console.log(error);
    }
}

function createConfirmationPopup() {
    // - Overlay
	const overlay = document.createElement('div');
	overlay.setAttribute('id', 'overlay');

	overlay.addEventListener('click', () => {
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

    // - Modal
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.setAttribute('id', 'modal');

    // - Modal Header
	const modalHeader = document.createElement('div');
	modalHeader.classList.add('modal-header');
    modalHeader.innerHTML = `
        <div class = "modal-title"> Delete </div>
    `;

    // - Close Button
	const closeButton = document.createElement('button');
	closeButton.setAttribute('data-close-button', '');
	closeButton.classList.add('close-button');
	closeButton.innerHTML = '&times;';

	closeButton.addEventListener('click', () => {
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

    // - Modal Body
    var tempProductName = parseObject(product).productName;
    console.log( tempProductName ); 

	const modalBody = document.createElement('div');
	modalBody.classList.add('modal-body');
	modalBody.innerHTML = `Are you sure you want to delete ${tempProductName}?
        This process cannot be undone.
    `;


    const confirmationContainer = document.createElement('div');
	confirmationContainer.classList.add('confirmation-container');

    const cancelButton = document.createElement('div');
    cancelButton.classList.add('confirm-button');
    cancelButton.innerHTML = 'cancel';
	cancelButton.addEventListener('click', () => {
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

    const confirmButton = document.createElement('div');
    confirmButton.classList.add('confirm-button');
    confirmButton.setAttribute('id', 'confirm');
    confirmButton.innerHTML = 'confirm';
    confirmButton.addEventListener('click', () => {
        deleteProduct(product);
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

    
	modalHeader.appendChild(closeButton);
    confirmationContainer.appendChild(cancelButton);
    confirmationContainer.appendChild(confirmButton);
    modalBody.appendChild(confirmationContainer);
	modal.appendChild(modalHeader);
	modal.appendChild(modalBody);

	document.body.appendChild(overlay);
	document.body.appendChild(modal);

	overlay.classList.add('active');
	modal.classList.add('active');

	return modal;
}