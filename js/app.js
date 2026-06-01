document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GESTION DE LA NAVIGATION INTERNE
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Retirer la classe active de l'ancien bouton
            document.querySelector(".nav-item.active").classList.remove("active");
            // Ajouter la classe active sur le bouton cliqué
            item.classList.add("active");

            // Cacher l'ancienne section active
            document.querySelector(".content-section.active").classList.remove("active");
            // Afficher la section ciblée
            const target = item.getAttribute("data-target");
            document.getElementById(target).classList.add("active");

            // Remonter automatiquement en haut de page
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // 2. GESTION DU COMMUTATEUR DE THÈME (CLAIR / SOMBRE)
    const themeBtn = document.getElementById("theme-btn");
    const htmlElement = document.documentElement;

    themeBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        
        if (currentTheme === "dark") {
            htmlElement.setAttribute("data-theme", "light");
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Mode Sombre';
        } else {
            htmlElement.setAttribute("data-theme", "dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Mode Clair';
        }
    });

    // 3. BOUTON DE COPIE DU CODE DANS LE PRESSE-PAPIER
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Récupérer le bloc <pre> qui suit l'en-tête du code
            const codeBlock = button.parentElement.nextElementSibling.querySelector("code");
            
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                // Effet visuel temporaire de validation
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i> Copié !';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error("Erreur de copie : ", err);
            });
        });
    });
});