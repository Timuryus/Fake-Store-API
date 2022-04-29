const BASE_URL = "https://fakestoreapi.com/";
const $container = document.querySelector(".row");
const $nav = document.querySelector(".navv");
const $search = document.querySelector(".input");
const $select = document.querySelector(".selection");

const category = [
  {
    title: "Electronics",
    route: "electronics",
  },
  {
    title: "Jewelery",
    route: "jewelery",
  },
  {
    title: "Men's clothing",
    route: "men`s clothing",
  },
  {
    title: "Women's clothing",
    route: "women`s clothing",
  },
];

function getRequest(endPoint, cb) {
  fetch(`${BASE_URL}${endPoint}`)
    .then((r) => r.json())
    .then((res) => {
      cb(res);
      console.log(res);
    });
}

window.addEventListener("load", () => {
  $container.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  setTimeout(
    () =>
      getRequest("products", (cb) => {
        cardTemplate(cb);
        getCategory(category);
      }),
    getRequest("products/categories", (cb) => {}),
    1000
  );
});

function cardTemplate(base) {
  const newBase = base
    .map(
      ({
        title,
        image,
        category,
        description,
        price,
        rating: { count, rate },
      }) => {
        return `
        <div class = "card">
            <div class = "card-header">
                <h1>${title}</h1>
            </div>
            <div class ="card-body">
                 <img src="${image}" alt="X">
            </div>
            <div class = "card-footer">
                <i>Category:${category}</i>
                <i>Description:${
                  description.length > 40
                    ? `${description.split("").slice(0, 151).join("")}...`
                    : description
                }
                </i>
                <i>Price:${price}$</i>
                <i>Rating:${count} ${rate}</i>
            </div>
        </div>
        `;
      }
    )
    .join("");

  $container.innerHTML = newBase;
}

function getCategory(base) {
  const template = base
    .map(({ route, title }) => {
      return `
      <div class = "nav">
          <h5 class = "categories" onclick="get_category('${route}')"> ${title}</h5>
      </div>
    `;
    })
    .join("");

  $nav.innerHTML = template;
  $nav.insertAdjacentHTML(
    "afterbegin",
    `
      <div class ="nav">
          <h5 class ="categories" onclick="location.reload()">all</h5>
      </div>
  `
  );
}

function get_category(el) {
  if (el === "electronics") {
    getRequest(`products/category/electronics`, (cb) => {
      cardTemplate(cb);
    });
  } else if (el === "jewelery") {
    getRequest(`products/category/jewelery`, (cb) => {
      cardTemplate(cb);
    });
  } else if (el === "men`s clothing") {
    getRequest("products/category/men's clothing", (cb) => {
      cardTemplate(cb);
    });
  } else if (el === "women`s clothing") {
    getRequest("products/category/women's clothing", (cb) => {
      cardTemplate(cb);
    });
  }
  $select.addEventListener("change", (e) => {
    let val = e.target.value;
    if (val === "name") {
      $search.setAttribute("placeholder", "search by name");
    } else if (val === "category") {
      $search.setAttribute("placeholder", "search by category");
    }
  });

  $search.addEventListener("input", (e) => {
    let value = e.target.value.toUpperCase();
    let val = $select.value;
    if (val === "name") {
      getRequest(`products`, (cb) => {
        const filtered = cb.filter((item) =>
          item.title.toUpperCase().includes(value)
        );
        cardTemplate(filtered);
      });
    } else if (val === "category") {
      getRequest(`products`, (cb) => {
        const filtered = cb.filter((item) =>
          item.category.toUpperCase().includes(value)
        );
        cardTemplate(filtered);
      });
    }
  });
}

