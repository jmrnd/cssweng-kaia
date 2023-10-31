const form = document.getElementById('register-product');
const feedbackText = document.getElementById('feedback-text');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    try {
        // - Get the form data            
        const categoryDropdown = document.getElementById('category-dropdown');
        const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
        const categoryID = selectedOption.getAttribute('data-id');
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description').value;
        const stock = parseInt(document.getElementById('stock').value);

        // - Validate input fields
        const areInputsValid = validateInputFields();
        if( !areInputsValid.status ) {
            feedbackText.className = "temporary error"
            feedbackText.textContent = areInputsValid.message;
            return false;
        }
        
        const formData = {
            name: name,
            price: price,
            description: description,
            stock: stock,
            categoryID: categoryID
        }

        // Send the POST request to your server
        var response = await fetch('/registerProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData ),
        });

        if( response.status == 201 ) {
            console.log( "Success!" );
            feedbackText.className = "temporary success";
            feedbackText.textContent = "Product " +  name + " created!";
        } else if( response.status == 500 ) {
            console.log( "Fail!" );
            feedbackText.textContent = response.message;
        }

        if( !imageDetails ) {
            return;
        }        

        // - if there is an image uploaded, link it to product
        var response = await fetch('/createProductImage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( imageDetails ),
        });

    } catch( error ) {
        console.log( error );
    }
});

const uploadImageButton = document.getElementById('upload-image');
uploadImageButton.addEventListener('change', async function() {
    try {
        const selectedFile = this.files[0];
        if( selectedFile ) {
            const formData = new FormData();
            formData.append( 'product', selectedFile );

            const response = await fetch('uploadProductImage', {
                method: "POST",
                body: formData,
            })

            if( response.status !== 200 ) {
                console.error( "Error uploading file" );
                return;
            }

            const data = await response.json();
            const { image } = data;
            imageDetails = image;
            await displayUploadedImage( image );
        }
    } catch( error ) {
        console.log( "uploadImageButton: ", error );
    }
});

const productImage = document.getElementById('product-image');
let imageDetails = null;

async function displayUploadedImage() {
    productImage.style.backgroundImage = `url(${imageDetails.filePath})`;
    productImage.style.backgroundSize = "cover"; 
}

function validateInputFields() {
    const name = document.getElementById('name');
    const price = document.getElementById('price');
    const stock = document.getElementById('stock');
    const description = document.getElementById('description');

    if( name.value == '' ) {
        return { status: false, message: "Error! Product name is missing."};
    } else if( price.value == '' ) {
        return { status: false, message: "Error! Product price is missing."};
    } else if( stock.value == '' ) {
        return { status: false, message: "Error! Product stock is missing."};
    } else if( description.value.trim() === '' ) {
        return { status: false, message: "Error! Product description is missing."};
    } else {
        return { status: true };
    }
}