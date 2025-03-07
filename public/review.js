document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#reviewForm');
    const submitButton = document.querySelector('.submit-button');
  
    if (!form || !submitButton) {
      console.error('Required form elements not found');
      return;
    }
  
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
  
      const name = document.getElementById('nameInput')?.value.trim();
      const rating = document.getElementById('ratingInput')?.value.trim();
      const reviewText = document.getElementById('reviewTextInput')?.value.trim();
  
      const errors = [];
      
      if (!name) errors.push('Please enter your name');
      if (!rating) {
        errors.push('Please provide a rating');
      } else if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.push('Rating must be a number between 1 and 5');
      }
      if (!reviewText) errors.push('Please enter your review');
  
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }
  
      try {
        // Add your submission logic here (e.g., API call)
        alert(`Thank you for your review, ${name}!`);
        
        // Clear form fields
        const inputs = [
          document.getElementById('nameInput'),
          document.getElementById('ratingInput'),
          document.getElementById('reviewTextInput')
        ];
        
        inputs.forEach(input => {
          if (input) input.value = '';
        });
        
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Sorry, there was an error submitting your review. Please try again.');
      }
    });
  });