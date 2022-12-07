import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, p, h1, table, tr, td, input } = hh(h);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const containerStyle = "container mx-auto my-8 max-w-md";
const inputContainerStyle = "flex items-center mt-4";
const inputStyle = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
const mealTableStyle = "mt-4 text-left";

const MSGS = {
  ADD_MEAL: "ADD_MEAL",
  DELETE_MEAL: "DELETE_MEAL",
};

function view(dispatch, model) {
  return div({ className: containerStyle }, [
    h1({ className: "text-2xl" }, `Calorie Counter`),
    div({ className: inputContainerStyle }, [
      input({ className: inputStyle, type: "text", placeholder: "Meal name", id: "meal-name" }),
      input({ className: inputStyle, type: "number", placeholder: "Calories", id: "meal-calories" }),
      button({ className: btnStyle, onclick: () => dispatch(MSGS.ADD_MEAL) }, "Add Meal"),
    ]),
    table({ className: mealTableStyle }, [
      ...model.meals.map((meal, index) => {
        return tr({ key: index }, [
          td({}, meal.name),
          td({}, `${meal.calories} calories`),
          td({},
            button({
              className: btnStyle,
              onclick: () => dispatch(MSGS.DELETE_MEAL, { index }),
            }, "Delete")
          ),
        ]);
      }),
    ]),
    p({ id: "total-calories" }, `Total calories: ${model.totalCalories}`),
  ]);
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_MEAL:
        const mealNameInput = document.getElementById("meal-name");
        const mealCaloriesInput = document.getElementById("meal-calories");
        return {
          ...model,
          meals: [...model.meals, { name: mealNameInput.value, calories: mealCaloriesInput.value }],
          totalCalories: model.totalCalories + parseInt(mealCaloriesInput.value),
        };
      case MSGS.DELETE_MEAL:
        const { index } = msg;
        const mealToDelete = model.meals[index];
        return {
          ...model,
          meals: [...model.meals.slice(0, index), ...model.meals.slice(index + 1)],
          totalCalories: model.totalCalories - mealToDelete.calories,
        };
      default:
        return model;
    }
  }
  
  function app(initModel, update, view, node) {
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);
    function dispatch(msg) {
      model = update(msg, model);
      const updatedView = view(dispatch, model);
      const patches = diff(currentView, updatedView);
      rootNode = patch(rootNode, patches);
      currentView = updatedView;
    }
  }
  
  const initModel = {
    meals: [],
    totalCalories: 0,
  };
  
  const rootNode = document.getElementById("app");
  
  app(initModel, update, view, rootNode);
  
