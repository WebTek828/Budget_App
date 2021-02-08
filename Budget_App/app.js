const formBtn = document.querySelector(".form__btn");
const income = document.querySelector(".incomes");
const expense = document.querySelector(".expenses");

const formType = document.querySelector(".form__select");
const formReason = document.querySelector(".form__reason");
const formAmount = document.querySelector(".form__amount");

const totalIncome = document.querySelector("#total-income");
const totalExpense = document.querySelector("#total-expense");

const availableBudget = document.getElementById("available-budget");

const lower = document.querySelector(".lower");

const date = document.querySelector(".date");

const totalExpensePercentage = document.querySelector(".expense__percentage");

totalIncome.textContent = 0;
totalExpense.textContent = 0;
totalExpensePercentage.textContent = "0%";

formBtn.addEventListener("click", (e) => {
  addOne(e);
});

class Income {
  constructor(id, reason, amount) {
    this.id = id;
    this.reason = reason;
    this.amount = amount;
  }
}

class Expense {
  constructor(id, reason, amount, percentage) {
    this.id = id;
    this.reason = reason;
    this.amount = amount;
    this.percentage = percentage;
  }
}

let allIncomes = [];
let allExpenses = [];

let totalInc = 0,
  totalExp = 0,
  totalBudget = 0;

function addOne(e) {
  e.preventDefault();

  const formTypeVal = formType.value;
  const formReasonVal = formReason.value;
  const formAmountVal = parseInt(formAmount.value);

  if (formReasonVal !== "" && formAmountVal !== "") {
    if (formTypeVal === "Income") {
      allIncomes.length === 0
        ? (id = 1)
        : (id = allIncomes[allIncomes.length - 1].id + 1);
      const income1 = new Income(id, formReasonVal, formAmountVal);
      const markupInc = `
                <div class="budget-container incomes__budget">
                  <span class="budget-reason incomes__reason">${formReasonVal}</span>
                  <span class="budget-money incomes__money">${maniString(
                    formAmountVal
                  )}</span>
                  <span class="delete" data-id=${id} id="income-delete" data-type=0></span>
                </div>`;
      allIncomes.push(income1);
      income.insertAdjacentHTML("beforeend", markupInc);
    } else {
      let id;
      allExpenses.length === 0
        ? (id = 1)
        : (id = allExpenses[allExpenses.length - 1].id + 1);
      const expense1 = new Expense(id, formReasonVal, formAmountVal);
      const markupExp = `
            <div class="budget-container expenses__budget">
                <span class="exp-percentage"></span>
                <span class="budget-reason expenses__reason">${formReasonVal}</span>
                <span class="budget-money expenses__money">${maniString(
                  formAmountVal
                )}</span>
                <span class="delete" id="expense-delete" data-id=${id} data-type=1></span>
            </div>
            
        `;
      allExpenses.push(expense1);
      expense.insertAdjacentHTML("beforeend", markupExp);
    }
    calBudget(formTypeVal);
    calPercentage();
    formAmount.value = "";
    formReason.value = "";
  } else {
    alert("Invalid input");
  }
}

function calBudget(type) {
  totalInc = 0;
  allIncomes.forEach((incs) => {
    totalInc += parseInt(incs.amount);
  });
  totalIncome.textContent = maniString(totalInc);

  totalExp = 0;
  allExpenses.forEach((exp) => {
    totalExp += parseInt(exp.amount);
  });

  totalExpense.textContent = maniString(totalExp);

  totalBudget = parseInt(totalInc) - parseInt(totalExp);
  availableBudget.textContent = maniString(totalBudget, true);
}

lower.addEventListener("click", (e) => {
  e.target.classList.contains("delete") && deleteHandler(e);
});

function deleteHandler(e) {
  e.target.parentNode.remove();
  const id = parseInt(e.target.dataset.id);
  const type = e.target.dataset.type;
  const types = [allIncomes, allExpenses];
  const allType = types[type].filter((t) => t.id !== id);
  type == 0 ? (allIncomes = allType) : (allExpenses = allType);
  calBudget();
  calPercentage();
}

function maniString(num, secondArg) {
  [num, deci] = num.toFixed(2).split(".");
  num = num.toString().split("");
  if (num.length > 3) {
    const firstIndex = num.splice(0, 1);
    let arr = [];
    let string = "";
    num.forEach((n, i) => {
      string += n;
      if (string.length === 3) {
        arr.push(string);
        string = "";
      }
      if (i === num.length - 1 && string.length < 3 && string.length !== 0) {
        arr.push(string);
      }
    });
    result = [...firstIndex, ...arr].join(",");
    secondArg ? (result = [result].concat(deci).join(".")) : null;
    return result;
  } else {
    if (!secondArg) {
      num = parseInt(num.join(""));
    } else {
      num = parseInt(num.join("")).toFixed(2);
    }
    return num;
  }
}

function calPercentage() {
  const expPercentage = document.querySelectorAll(".exp-percentage");
  if (allExpenses.length > 0) {
    const allAmounts = allExpenses.map((exp) => exp.amount);
    const allPercentages = allAmounts.map((amount) => {
      return `${parseInt((amount / totalInc) * 100)}%`;
    });
    expPercentage.forEach((e, i) => {
      e.textContent = allPercentages[i];
    });
    const totalPercentage = `${parseInt((totalExp / totalInc) * 100)}`;
    totalExpensePercentage.textContent = `${totalPercentage}%`;
  }
}

const months = "January,February,March,April,May,June,July,August,September,October,November,December".split(
  ","
);

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const displayDate = `${months[month]} ${day} ${year}`;

date.textContent = displayDate;
