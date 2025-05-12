document.getElementById("cardForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expMonth = parseInt(document.getElementById("expMonth").value);
  const expYear = parseInt(document.getElementById("expYear").value);
  const cvv = document.getElementById("cvv").value.trim();
  const feedback = document.getElementById("feedback");

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const isValidLength = cardNumber.length === 16;
  const isMastercard = /^(51|52|53|54|55)/.test(cardNumber);
  const isValidCVV = cvv.length === 3 || cvv.length === 4;
  const isNotExpired = expYear > currentYear || (expYear === currentYear && expMonth >= currentMonth);

  if (!isValidLength || !isMastercard || !isValidCVV || !isNotExpired) {
    feedback.textContent = "Invalid input. Please check your card details.";
    feedback.style.color = "red";
    return;
  }

  const data = {
    master_card: Number(cardNumber),
    exp_year: expYear,
    exp_month: expMonth,
    cvv_code: cvv
  };

  const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then((response) => {
    return response.json().then((resJson) => {
      console.log("Server response:", resJson); 
      
      
      if (response.ok) {
        localStorage.setItem("lastFourDigits", cardNumber.slice(-4));
        window.location.href = "success.html";
      } else {
        document.getElementById("feedback").textContent = 
          resJson.message || "Payment unsuccessful.";
      }
    });
  })
  
  
  
    .catch((error) => {
      console.error("Payment failed:", error);
      feedback.textContent = error;
      feedback.style.color = "red";
    });
});
