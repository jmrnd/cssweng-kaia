/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const registerProductForm = document.getElementById('register-product');
const feedbackText = document.getElementById('feedback-text');
const header = document.getElementById('register-header');

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

/***********************************************
                    VARIABLES                   
***********************************************/
/**
    imageDetails = { 
        'imageID', 'userID', 'originalName', 'fileName', 
        'filePath', 'destination', 'dateAdded' 
    }
*/
var imageDetails = [];

/**
    variations = { 
        { 'name', 'stock', 'color' },
        { 'name', 'stock', 'color' }
    }
*/
var variations = []; 


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

/***********************************************
             REGISTER PRODUCT BUTTON            
***********************************************/
/**
    ` When the "register" button is submitted, this function:
        1. Validate the input fields 
        2. Retrieves the product details as form data
        3. Register a new product by sending a POST request
        4. Display appropriate feedback messages
        5. Optionally link images to the product
*/
registerProductForm.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    //: returns { 'status' as boolean, 'message' as response }
    const areInputFieldsValid = validateInputFields();
    if( !areInputFieldsValid.status ) {
        feedbackText.className = "feedback error";
        feedbackText.textContent = areInputFieldsValid.message;
        header.style.paddingTop = "20px";
        return;
    } else if( variations.length === 0 ) {
        feedbackText.className = "feedback error";
        feedbackText.textContent = "Error! Please create a variation.";
        header.style.paddingTop = "20px";
        return; 
    }

    try {
        //: returns { 'name', 'price', 'description', 'stock', 'categoryID' }
        const productFormData = await getProductFormData();

        //: returns { 'status' as error codes, 'message' as response, 'productID' if successful }
        const productResponse = await fetchPost( '/registerProduct', productFormData );
       
        //: displays appropriate feedback messages based on response status
        if( productResponse.status == 201 ) {
            feedbackText.className = "feedback success";
            feedbackText.textContent = "Product " +  productFormData.name + " has been successfully registered!";
            header.style.paddingTop = "20px";
        } else if( productResponse.status == 500 ) {
            feedbackText.className = "feedback error";
            feedbackText.textContent = productResponse.message;
            header.style.paddingTop = "20px";
            return;
        }

        // - create the form data for variations:  { 'productID', [{ 'name', 'color', 'stock' }] }
        const parsedProducts = await productResponse.json();
        const productID = parsedProducts.productID;
        const variationsFormData = { productID: productID, variations: variations };

        console.log( variationsFormData );  

        const variationsResponse = await fetchPost( '/createProductVariations', variationsFormData );

        if( imageDetails.length === 0 ) {
            return;
        }        

        //: { 'imageID', 'userID', 'originalName', 'fileName', 'filePath', 'destination', 'dateAdded' }
        const imageDetailsFormData = { imageDetails: imageDetails };

        // - upload image reference
        const imageReferencesResponse = await fetchPost( '/uploadImageReference', imageDetailsFormData );

        // - retrieve the image id that has been uploaded
        const parsedImagesID = await imageReferencesResponse.json();
        const imageIDFormData = { productID: productID, imagesID: parsedImagesID.imagesID };

        // - link image to product
        const productImagesResponse = await fetchPost( '/createProductImage', imageIDFormData );


        resetInputFields();

        
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

        console.log( "selectedFile", selectedFile );
        console.log( "imageDetails", imageDetails );
        
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
