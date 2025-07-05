<template>
  <div class="container">
    <div class="about-page">
      <div class="hero-section">
        <h1 class="display-4 text-center mb-4">About Grandma's Recipes</h1>
        <p class="lead text-center">
          Welcome to Grandma's Recipes - your digital cookbook where family traditions meet modern convenience.
        </p>
      </div>

      <div class="row mt-5">
        <div class="col-md-6">
          <div class="feature-card">
            <div class="feature-icon">
              🍳
            </div>
            <h3>Discover Recipes</h3>
            <p>
              Explore thousands of recipes from Spoonacular's extensive database. Find the perfect dish for any occasion, 
              dietary preference, or cooking skill level.
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="feature-card">
            <div class="feature-icon">
              👨‍👩‍👧‍👦
            </div>
            <h3>Family Traditions</h3>
            <p>
              Preserve your family's culinary heritage by creating and sharing family recipes. Keep those precious 
              traditions alive for future generations.
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="feature-card">
            <div class="feature-icon">
              📝
            </div>
            <h3>Create Your Own</h3>
            <p>
              Share your culinary creativity by adding your own recipes. Document your cooking experiments and 
              favorite dishes for others to enjoy.
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="feature-card">
            <div class="feature-icon">
              ⭐
            </div>
            <h3>Personalized Experience</h3>
            <p>
              Like, favorite, and save recipes to create your personalized cookbook. Track your viewing history 
              and build your meal planning around your preferences.
            </p>
          </div>
        </div>
      </div>

      <div class="mission-section mt-5">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Our Mission</h2>
            <p class="card-text">
              At Grandma's Recipes, we believe that food brings people together. Our platform is designed to make 
              cooking accessible, enjoyable, and meaningful for everyone. Whether you're a beginner looking for simple 
              recipes or an experienced chef seeking inspiration, we're here to support your culinary journey.
            </p>
            <p class="card-text">
              We combine the vast recipe database of Spoonacular with the personal touch of family recipes, creating 
              a unique space where tradition and innovation coexist. Every meal tells a story, and we're here to help 
              you write yours.
            </p>
          </div>
        </div>
      </div>

      <div class="features-section mt-5">
        <h2 class="text-center mb-4">What You Can Do</h2>
        <div class="row">
          <div class="col-md-4">
            <div class="info-card">
              <h4>🔍 Search & Filter</h4>
              <p>Find recipes by cuisine, diet, ingredients, or cooking time</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-card">
              <h4>📱 Meal Planning</h4>
              <p>Plan your meals ahead and organize your cooking schedule</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="info-card">
              <h4>👨‍🍳 Step-by-Step</h4>
              <p>Follow detailed preparation instructions with equipment lists</p>
            </div>
          </div>
        </div>
      </div>

      <div class="tech-section mt-5">
        <div class="card bg-light">
          <div class="card-body">
            <h2 class="card-title text-center">Technology</h2>
            <p class="text-center">
              This application is built with modern web technologies to provide you with a seamless experience:
            </p>
            <div class="row text-center mt-4">
              <div class="col-md-3">
                <div class="tech-item">
                  <strong>Vue.js</strong>
                  <p>Frontend Framework</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="tech-item">
                  <strong>Node.js</strong>
                  <p>Backend Runtime</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="tech-item">
                  <strong>MySQL</strong>
                  <p>Database</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="tech-item">
                  <strong>Spoonacular API</strong>
                  <p>Recipe Database</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="projects-section mt-5">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Our Previous Work</h2>
            <p class="text-center mb-4">
              Check out some of our other projects that showcase our development skills:
            </p>
            
            <div class="row">
              <div class="col-md-4">
                <div class="project-card">
                  <h4>🎮 Chicken Invaders Game</h4>
                  <p>A web-based copycat of the classic Chicken Invaders game built with modern web technologies.</p>
                  <a href="https://github.com/WED-2023/assignment2-206515744_209406255_assignment2" 
                     target="_blank" 
                     class="btn btn-outline-primary btn-sm">
                    <i class="fab fa-github"></i> View on GitHub
                  </a>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="project-card">
                  <h4>👨‍💻 Ilay Cohen</h4>
                  <p>Personal website showcasing projects, skills, and experience of our first team member.</p>
                  <a href="https://github.com/WED-2023/206515744" 
                     target="_blank" 
                     class="btn btn-outline-primary btn-sm">
                    <i class="fab fa-github"></i> View on GitHub
                  </a>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="project-card">
                  <h4>👩‍💻 Victor Gavrilenko</h4>
                  <p>Personal website showcasing projects, skills, and experience of our second team member.</p>
                  <a href="https://github.com/WED-2023/209406255" 
                     target="_blank" 
                     class="btn btn-outline-primary btn-sm">
                    <i class="fab fa-github"></i> View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  computed: {
    store() {
      return window.store;
    }
  }
};
</script>

<style scoped>
.about-page {
  padding: 2rem 0;
}

.hero-section {
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.mission-section .card {
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;
}

.info-card:hover {
  background: #e9ecef;
}

.info-card h4 {
  color: #42b983;
  margin-bottom: 0.5rem;
}

.tech-item {
  padding: 1rem;
}

.tech-item strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.tech-item p {
  color: #6c757d;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.projects-section .card {
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.project-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-card:hover {
  background: #e9ecef;
  transform: translateY(-3px);
}

.project-card h4 {
  color: #42b983;
  margin-bottom: 1rem;
}

.project-card p {
  color: #6c757d;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.project-card .btn {
  margin-top: auto;
}

.action-buttons {
  margin-top: 2rem;
}

.contact-section {
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 15px;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .feature-card {
    margin-bottom: 1.5rem;
  }
  
  .project-card {
    margin-bottom: 1.5rem;
  }
  
  .action-buttons .btn {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .action-buttons .btn.me-3 {
    margin-right: 0 !important;
  }
}
</style>
