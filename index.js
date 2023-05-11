//import items from "./materials.json" assert { type: "json" };

let items;

let selectedItem;
let materialContainer;

let table;
let tbody;

let selectedCategory;
let categoryDropdown;
let selectedMod;
let modDropdown;

window.onload = function() {
   fetch("./materials.json").then((res) => res.json()).then((data) => {
      items = data;
      table = document.createElement("table");
      table.setAttribute("id", "table");
      table.setAttribute("class", "table table-dark table-striped table-borderless");

      materialContainer = document.createElement("div");
      materialContainer.setAttribute("id", "material-container");
      materialContainer.setAttribute("class", "container");

      categoryDropdown = document.getElementById("category-filter");
      modDropdown = document.getElementById("mod-filter");

      let row = document.createElement("div");
      row.setAttribute("class", "row row-cols-auto");

      for (let key in items)
      {
         let item = items[key];

         if (!item.showInList)
            continue;

         let col = document.createElement("div");
         col.setAttribute("id", "col_" + item.id);
         col.setAttribute("class", "mat-col col");

         let button = document.createElement("button");
         button.setAttribute("type", "button");
         button.setAttribute("id", "button_" + item.id);
         button.setAttribute("class", "btn btn-outline-dark");
         button.setAttribute("data-bs-toggle", "tooltip");
         button.setAttribute("data-bs-placement", "top");
         button.setAttribute("data-bs-custom-class", "custom-tooltip");
         button.setAttribute("title", item.name);
         button.style.setProperty("background-image", "url(" + item.img + ")");

         button.onclick = () =>
         {
            document.getElementById("count").focus();

            if (selectedItem)
               document.getElementById("button_" + selectedItem.id).style.borderColor = "";

            selectedItem = item;
            document.getElementById("button_" + selectedItem.id).style.borderColor = "#15a35a";


            displayList(item);

            listSection.style.opacity = "100%";
            listSection.style.width = "30%";
         };

         button.onauxclick = () => window.open(item.link);

         col.appendChild(button);
         row.appendChild(col);
      }

      //selectedItem = items["quartz_enriched_iron"];

      materialContainer.appendChild(row);

      document.getElementById("material-section").appendChild(materialContainer);

      let listSection = document.createElement("div");
      listSection.setAttribute("id", "list-section");

      listSection.appendChild(table);
      document.getElementById("information").appendChild(listSection);

      let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      let tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

      displayList(selectedItem);
   });
}

document.getElementById("count").oninput = function()
{
   if (selectedItem)
      displayList(selectedItem);
}

document.getElementById("category-filter").onclick = function(clicked)
{
   selectedCategory = clicked.target.innerText;

   document.getElementById("categoryButton").innerText = selectedCategory;
   document.getElementById("categoryButton").textContent = selectedCategory;

   if (selectedCategory == "All")
   {
      document.getElementById("categoryButton").innerText = "Category";
      document.getElementById("categoryButton").textContent = "Category";

      for (const element of materialContainer.children[0].children)
         element.style.display = "block";

      return;
   }

   filterItems();
}

document.getElementById("categories").oninput = function (value)
{
   selectedCategory = value.target.value;

   filterItems();
};

document.getElementById("mods").oninput = function(value)
{
   selectedMod = value.target.value;

   filterItems();
}

document.getElementById("filter").oninput = filterItems;

function filterItems()
{
   let filterInput = document.getElementById("filter");
   let filterText = filterInput.value.toLowerCase();

   for (const element of materialContainer.children[0].children) 
   {
      let item = items[element.id.replace("col_", "")];

      if (isInList(item.name, filterText))
         element.style.display = "";
      else
         element.style.display = "none";

      if (!isInCategory(item.category))
         element.style.display = "none";

      if (!isInMod(item.mod))
         element.style.display = "none";
   }
}

let isInList = (itemName, filterText) => !filterText ? true : itemName.toLowerCase().includes(filterText.toLowerCase());
let isInCategory = (category) => !selectedCategory || selectedCategory == "All" ? true : category.toLowerCase().includes(selectedCategory.toLowerCase());
let isInMod = (mod) => !selectedMod || selectedMod == "All" ? true : mod.toLowerCase().includes(selectedMod.toLowerCase());

function displayList(item)
{
   if (!selectedItem)
      return;

   let total = parseInt(document.getElementById("count").value);
   if (isNaN(total))
      total = 1;

   table.replaceChildren();

   let thead = document.createElement("thead");
   thead.style.position = "sticky";
   thead.style.top = "0";

   let tr = document.createElement("tr");

   let thImage = document.createElement("th");

   let thName = document.createElement("th");
   thName.innerText = "Material";
   thName.textContent = "Material";
   thName.style.paddingLeft = "2px";

   let thCount = document.createElement("th");
   thCount.innerText = "#";
   thCount.textContent = "#";

   let thCheck = document.createElement("th");
   thCheck.setAttribute("class", "text-center");
   thCheck.innerText = "Own?";
   thCheck.textContent = "Own?";

   tr.append(thImage, thName, thCount, thCheck);
   thead.appendChild(tr);
   table.appendChild(thead);

   tbody = document.createElement("tbody");

   table.appendChild(tbody);

   displayItem(item, total);
}

function displayItem(item, total)
{
   if (!item)
      return;
   
   let tr = document.getElementById("tr_" + item.id);

   if (tr)
   {
      let countElement = tr.children[2];
      let value = parseInt(countElement.textContent) || parseInt(countElement.innerText);

      value += total;

      tr.children[2].innerText = value;
      tr.children[2].textContent = value;
   }
   else
   {
   tr = tbody.insertRow(-1);
   tr.setAttribute("id", "tr_" + item.id);

   let imageCol = tr.insertCell(0);
   imageCol.setAttribute("class", "th-sm-2 text-center align-middle");
   imageCol.style.padding = "2px";
   imageCol.style.width = "60px";

   let matImage = document.createElement("img");
   matImage.setAttribute("src", item.img);
   matImage.setAttribute("class", "matImage text-center align-middle");
   matImage.style.width = "30px";
   matImage.style.height = "30px";

   matImage.onclick = () => window.open(item.link);

   imageCol.appendChild(matImage);

   let tdName = tr.insertCell(1);
   tdName.setAttribute("class", "align-middle");
   tdName.style.paddingLeft = "2px";

   let tdNameText = document.createElement("p");
   tdNameText.innerText = item.name;
   tdNameText.textContent = item.name;
   tdNameText.setAttribute("class", "tdNameText align-middle");
   tdNameText.style.display = "inline-block";
   tdNameText.style.margin = "0";

   tdNameText.onclick = () => window.open(item.link);

   tdName.appendChild(tdNameText);

   let tdCount = tr.insertCell(2);

   if (item.id == selectedItem.id && item.min_crafted)
   {
      tdCount.innerText = total * item.min_crated;
      tdCount.textContent = total * item.min_crafted;
   }
   else
   {
      tdCount.innerText = total;
      tdCount.textContent = total;
   }
   tdCount.setAttribute("class", "tdCount align-middle");

   let checkCell = tr.insertCell(3);
   checkCell.setAttribute("class", "text-center align-middle");

   let check = document.createElement("input");
   check.setAttribute("type", "checkbox");
   check.setAttribute("value", "");
   check.setAttribute("class", "form-check-input");

   check.onclick = () =>
   {
      if (check.checked)
      {
         tdNameText.style.color = "#15a35a";
         tr.style.color = "#15a35a";
      }
      else
      {
         tdNameText.style.color = "#0d6efd";
         tr.style.color = "white";
      }
   };

   checkCell.appendChild(check);

   tbody.appendChild(tr);
   }

   if (item.mats)
   {
      for (let key in item.mats)
      {
         let name = item.mats[key].mat;
         let count = item.mats[key].count;

         displayItem(items[name], count * total);
      }
   }
}