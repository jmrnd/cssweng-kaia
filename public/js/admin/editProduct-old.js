/***********************************************
                DOCUMENT ELEMENTS                   
***********************************************/
const updateButton = document.getElementById('update-button');
const deleteButton = document.getElementById('delete-button');
const feedbackText = document.getElementById('feedback-text');

/***********************************************
                   VARIABLES                   
***********************************************/
var imagesArray = [];
var variationsArray = [];


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
            LOAD PRODUCT DETAILS BUTTON                   
***********************************************/
document.addEventListener("DOMContentLoaded", function () {
    const parsedProduct = parseObject(product);
    const productName = parsedProduct.productName;
    const price = parsedProduct.price;
    const productDescription = parsedProduct.productDescription;
  
    document.getElementById("name").value = productName;
    document.getElementById("price").value = price;
    document.getElementById("description").value = productDescription;
});

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
        <div class = "title"> Delete </div>
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

/***********************************************
                  UPDATE BUTTON                   
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
            feedbackText.className = "temporary error"
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

            feedbackText.className = "temporary success";
            feedbackText.textContent = "Product (ID#" + productID + ") " + name +  " updated on " + formattedDate;
        } else if( response.status == 500 ) {
            feedbackText.textContent = response.message;
        }
    } catch( error ) {
        console.log( error );
    }
});


/***********************************************
                    VALIDATION                   
***********************************************/
function validateInputFields() {
    const name = document.getElementById('name');
    const price = document.getElementById('price');
    const description = document.getElementById('description');

    if( name.value == '' ) {
        return { status: false, message: "Error! Product name is missing."};
    } else if( price.value == '' ) {
        return { status: false, message: "Error! Product price is missing."};
    } else if( description.value.trim() === '' ) {
        return { status: false, message: "Error! Product description is missing."};
    } else {
        return { status: true };
    }
}