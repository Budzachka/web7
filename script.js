async function loadCategories() {
    try {
        const response = await fetch('categories.json');
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Error loading categories:', error);
        return [];
    }
}

async function loadProducts(categoryShortname) {
    try {
        const response = await fetch(`${categoryShortname}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading products:', error);
        return null;
    }
}

async function loadHome() {
    const content = document.getElementById('content');
    const categories = await loadCategories();
    
    let html = '<div class="row row-cols-1 row-cols-md-2 g-4">';
    
    categories.forEach(category => {
        html += `
            <div class="col">
                <div class="card category-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <p class="card-text">${category.notes}</p>
                        <a href="#" class="btn btn-primary" onclick="loadCategory('${category.shortname}')">Переглянути товари</a>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
        <div class="col">
            <div class="card category-card h-100">
                <div class="card-body">
                    <h5 class="card-title">Specials</h5>
                    <p class="card-text">Спеціальні пропозиції та акції</p>
                    <a href="#" class="btn btn-danger" onclick="loadRandomCategory()">Переглянути пропозиції</a>
                </div>
            </div>
        </div>
    `;

    html += '</div>';
    content.innerHTML = html;
}

async function loadCategory(categoryShortname) {
    const content = document.getElementById('content');
    const categoryData = await loadProducts(categoryShortname);
    
    if (!categoryData) {
        content.innerHTML = '<div class="alert alert-danger">Помилка завантаження категорії</div>';
        return;
    }

    let html = `
        <h2 class="category-title mb-4">${categoryData.category}</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
    `;

    categoryData.products.forEach(product => {
        const imageUrl = `https://place-hold.it/200x200/666/fff/000?text=${encodeURIComponent(product.name)}&fontsize=14`;
        html += `
            <div class="col">
                <div class="card product-card">
                    <img src="${imageUrl}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price">${product.price} грн</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    content.innerHTML = html;
}

async function loadRandomCategory() {
    const categories = await loadCategories();
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomIndex];
    await loadCategory(randomCategory.shortname);
}

function loadCatalog() {
    loadHome();
}

document.addEventListener('DOMContentLoaded', loadHome); 