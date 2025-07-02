const productData = {
    'dress-1': {
        name: 'Robe Africaine Élégante',
        price: 89.99,
        description: 'Robe traditionnelle en wax authentique, coupe moderne',
        category: 'vetements',
        image: 'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'outfit-1': {
        name: 'Ensemble Traditionnel',
        price: 129.99,
        description: 'Ensemble complet avec motifs géométriques',
        category: 'vetements',
        image: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'shirt-1': {
        name: 'Chemise Africaine Homme',
        price: 69.99,
        description: 'Chemise en coton avec broderies traditionnelles',
        category: 'vetements',
        image: 'https://images.pexels.com/photos/6663542/pexels-photo-6663542.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'bracelet-1': {
        name: 'Bracelets Artisanaux',
        price: 29.99,
        description: 'Set de 3 bracelets en perles naturelles',
        category: 'bijoux',
        image: 'https://images.pexels.com/photos/1454243/pexels-photo-1454243.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'earrings-1': {
        name: 'Boucles d\'oreilles Ethniques',
        price: 39.99,
        description: 'Boucles d\'oreilles en laiton doré',
        category: 'bijoux',
        image: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'necklace-1': {
        name: 'Collier Traditionnel',
        price: 59.99,
        description: 'Collier en perles de bois sculpté',
        category: 'bijoux',
        image: 'https://images.pexels.com/photos/3985333/pexels-photo-3985333.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'cream-1': {
        name: 'Crème Hydratante Naturelle',
        price: 24.99,
        description: 'À base de beurre de karité pur',
        category: 'cosmetiques',
        image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'oil-1': {
        name: 'Huile de Coco Bio',
        price: 19.99,
        description: 'Huile pure pour cheveux et peau',
        category: 'cosmetiques',
        image: 'https://images.pexels.com/photos/3985333/pexels-photo-3985333.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'soap-1': {
        name: 'Savon Noir Africain',
        price: 12.99,
        description: 'Savon traditionnel purifiant',
        category: 'cosmetiques',
        image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'bag-1': {
        name: 'Sac en Raphia',
        price: 45.99,
        description: 'Sac tissé à la main, motifs traditionnels',
        category: 'accessoires',
        image: 'https://images.pexels.com/photos/5625120/pexels-photo-5625120.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    'scarf-1': {
        name: 'Foulard en Wax',
        price: 25.99,
        description: 'Foulard multicolore en coton wax',
        category: 'accessoires',
        image: 'https://images.pexels.com/photos/6663542/pexels-photo-6663542.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
};

function getProductDetails(productId) {
    return productData[productId] || null;
}

function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.setAttribute('data-aos', 'fade-up');
                    AOS.refresh();
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initProductFilters();
});