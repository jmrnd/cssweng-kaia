const form = document.getElementById('product-form');
const feedbackText = document.getElementById('feedback-text');

form.addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const categoryDropdown = document.getElementById('category-dropdown');
    const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
    const categoryID = selectedOption.getAttribute('data-id');


    try {
        // - Get the form data            
        const categoryDropdown = document.getElementById('category-dropdown');
        const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
        const categoryID = selectedOption.getAttribute('data-id');
        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description').value;
        const stock = parseInt(document.getElementById('stock').value);

        // - Validate that stock is an integer
        if( !Number.isInteger(stock) ) {
            alert('Please enter a valid stock quantity (integer)');
            return;
        }

        const formData = {
            name: name,
            price: price,
            description: description,
            stock: stock,
            categoryID: categoryID
        }
        
        // Send the POST request to your server
        const response = await fetch('/registerProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( formData ),
        });

        console.log( response );

        if( response.status == 201 ) {
            console.log( "Success!" );
            feedbackText.textContent = "Product " +  name + " created!";
        } else if( response.status == 500 ) {
            console.log( "Fail  !" );
            feedbackText.textContent = response.message;
        }

    } catch( error ) {
        console.log( error );
    }
});
