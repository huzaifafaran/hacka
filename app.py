from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Predefined skill gap analysis responses
ROLE_RESPONSES = {
    "Full Stack Developer": {
        "missingSkills": ["Docker", "AWS", "MongoDB", "GraphQL"],
        "partialSkills": [
            {"name": "Node.js", "currentLevel": 60, "requiredLevel": 80},
            {"name": "Python", "currentLevel": 50, "requiredLevel": 70}
        ],
        "recommendations": [
            {
                "title": "Complete Node.js Developer Course",
                "provider": "Udemy",
                "duration": "2 months",
                "difficulty": "Intermediate",
                "url": "https://www.udemy.com/course/complete-nodejs-developer-zero-to-mastery/",
                "skillsCovered": ["Node.js", "Express", "MongoDB"]
            },
            {
                "title": "AWS Certified Developer Associate",
                "provider": "AWS",
                "duration": "3 months",
                "difficulty": "Advanced",
                "url": "https://aws.amazon.com/certification/certified-developer-associate/",
                "skillsCovered": ["AWS", "Cloud Computing", "Serverless"]
            }
        ]
    },
    "Frontend Developer": {
        "missingSkills": ["Vue.js", "Angular", "Web Performance", "Testing"],
        "partialSkills": [
            {"name": "React", "currentLevel": 70, "requiredLevel": 90},
            {"name": "TypeScript", "currentLevel": 60, "requiredLevel": 80}
        ],
        "recommendations": [
            {
                "title": "Advanced React Patterns",
                "provider": "Frontend Masters",
                "duration": "1 month",
                "difficulty": "Advanced",
                "url": "https://frontendmasters.com/courses/advanced-react-patterns/",
                "skillsCovered": ["React", "Design Patterns", "Performance"]
            },
            {
                "title": "Testing JavaScript Applications",
                "provider": "Kent C. Dodds",
                "duration": "2 weeks",
                "difficulty": "Intermediate",
                "url": "https://testingjavascript.com/",
                "skillsCovered": ["Testing", "Jest", "React Testing Library"]
            }
        ]
    },
    "Backend Developer": {
        "missingSkills": ["System Design", "Redis", "Message Queues", "Microservices"],
        "partialSkills": [
            {"name": "Node.js", "currentLevel": 60, "requiredLevel": 85},
            {"name": "Database Design", "currentLevel": 50, "requiredLevel": 80}
        ],
        "recommendations": [
            {
                "title": "System Design for Developers",
                "provider": "ByteByteGo",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://bytebytego.com/",
                "skillsCovered": ["System Design", "Scalability", "Microservices"]
            },
            {
                "title": "Database Design Fundamentals",
                "provider": "Pluralsight",
                "duration": "1 month",
                "difficulty": "Intermediate",
                "url": "https://www.pluralsight.com/courses/database-design-fundamentals",
                "skillsCovered": ["Database Design", "SQL", "Normalization"]
            }
        ]
    },
    "DevOps Engineer": {
        "missingSkills": ["Kubernetes", "Terraform", "CI/CD", "Monitoring"],
        "partialSkills": [
            {"name": "Docker", "currentLevel": 50, "requiredLevel": 80},
            {"name": "Linux", "currentLevel": 60, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "Certified Kubernetes Administrator",
                "provider": "Linux Foundation",
                "duration": "3 months",
                "difficulty": "Advanced",
                "url": "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
                "skillsCovered": ["Kubernetes", "Container Orchestration"]
            },
            {
                "title": "HashiCorp Terraform Associate",
                "provider": "HashiCorp",
                "duration": "1 month",
                "difficulty": "Intermediate",
                "url": "https://www.hashicorp.com/certification/terraform-associate",
                "skillsCovered": ["Terraform", "Infrastructure as Code"]
            }
        ]
    },
    "Data Scientist": {
        "missingSkills": ["Deep Learning", "Big Data", "MLOps", "Statistical Analysis"],
        "partialSkills": [
            {"name": "Python", "currentLevel": 70, "requiredLevel": 90},
            {"name": "Machine Learning", "currentLevel": 60, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "Deep Learning Specialization",
                "provider": "Coursera",
                "duration": "4 months",
                "difficulty": "Advanced",
                "url": "https://www.coursera.org/specializations/deep-learning",
                "skillsCovered": ["Deep Learning", "Neural Networks", "TensorFlow"]
            },
            {
                "title": "Applied Data Science with Python",
                "provider": "DataCamp",
                "duration": "2 months",
                "difficulty": "Intermediate",
                "url": "https://www.datacamp.com/tracks/data-scientist-with-python",
                "skillsCovered": ["Data Analysis", "Machine Learning", "Statistics"]
            }
        ]
    },
    "Machine Learning Engineer": {
        "missingSkills": ["MLOps", "Model Deployment", "Distributed Training", "Model Optimization"],
        "partialSkills": [
            {"name": "Python", "currentLevel": 75, "requiredLevel": 90},
            {"name": "TensorFlow", "currentLevel": 60, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "MLOps Specialization",
                "provider": "Coursera",
                "duration": "3 months",
                "difficulty": "Advanced",
                "url": "https://www.coursera.org/specializations/mlops-machine-learning-duke",
                "skillsCovered": ["MLOps", "Model Deployment", "Pipeline Automation"]
            },
            {
                "title": "Advanced Machine Learning",
                "provider": "Fast.ai",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://www.fast.ai/",
                "skillsCovered": ["Deep Learning", "PyTorch", "Computer Vision"]
            }
        ]
    },
    "Cloud Architect": {
        "missingSkills": ["Multi-Cloud", "Cloud Security", "Cost Optimization", "Serverless"],
        "partialSkills": [
            {"name": "AWS", "currentLevel": 70, "requiredLevel": 90},
            {"name": "Infrastructure as Code", "currentLevel": 65, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "AWS Solutions Architect Professional",
                "provider": "AWS",
                "duration": "6 months",
                "difficulty": "Expert",
                "url": "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
                "skillsCovered": ["AWS", "Architecture", "Best Practices"]
            },
            {
                "title": "Google Cloud Professional Architect",
                "provider": "Google Cloud",
                "duration": "3 months",
                "difficulty": "Advanced",
                "url": "https://cloud.google.com/certification/cloud-architect",
                "skillsCovered": ["GCP", "Multi-Cloud", "Security"]
            }
        ]
    },
    "Mobile App Developer": {
        "missingSkills": ["React Native", "Flutter", "Mobile Security", "App Store Optimization"],
        "partialSkills": [
            {"name": "JavaScript", "currentLevel": 75, "requiredLevel": 90},
            {"name": "Mobile UI/UX", "currentLevel": 60, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "React Native - The Practical Guide",
                "provider": "Udemy",
                "duration": "2 months",
                "difficulty": "Intermediate",
                "url": "https://www.udemy.com/course/react-native-the-practical-guide/",
                "skillsCovered": ["React Native", "Mobile Development", "Cross-Platform"]
            },
            {
                "title": "Flutter & Dart - The Complete Guide",
                "provider": "Academind",
                "duration": "3 months",
                "difficulty": "Intermediate",
                "url": "https://pro.academind.com/p/flutter-dart-the-complete-guide",
                "skillsCovered": ["Flutter", "Dart", "Material Design"]
            }
        ]
    },
    "UI/UX Designer": {
        "missingSkills": ["User Research", "Design Systems", "Prototyping Tools", "Accessibility"],
        "partialSkills": [
            {"name": "Figma", "currentLevel": 70, "requiredLevel": 90},
            {"name": "User Testing", "currentLevel": 55, "requiredLevel": 80}
        ],
        "recommendations": [
            {
                "title": "Advanced Design Systems",
                "provider": "Designership",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://designership.com/",
                "skillsCovered": ["Design Systems", "Component Libraries", "Style Guides"]
            },
            {
                "title": "Google UX Design Professional Certificate",
                "provider": "Coursera",
                "duration": "6 months",
                "difficulty": "Intermediate",
                "url": "https://www.coursera.org/professional-certificates/google-ux-design",
                "skillsCovered": ["UX Research", "User Testing", "Design Thinking"]
            }
        ]
    },
    "Product Manager": {
        "missingSkills": ["Product Strategy", "Market Research", "Data Analytics", "Agile Leadership"],
        "partialSkills": [
            {"name": "Product Development", "currentLevel": 65, "requiredLevel": 85},
            {"name": "Stakeholder Management", "currentLevel": 70, "requiredLevel": 90}
        ],
        "recommendations": [
            {
                "title": "Product Management Certification",
                "provider": "Product School",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://productschool.com/product-management-certification/",
                "skillsCovered": ["Product Strategy", "Market Analysis", "Product Development"]
            },
            {
                "title": "Agile Product Management",
                "provider": "Scrum.org",
                "duration": "1 month",
                "difficulty": "Intermediate",
                "url": "https://www.scrum.org/professional-scrum-product-owner-certification",
                "skillsCovered": ["Agile", "Scrum", "Product Ownership"]
            }
        ]
    },
    "Software Architect": {
        "missingSkills": ["Enterprise Architecture", "Scalability Patterns", "Domain-Driven Design", "Event-Driven Architecture"],
        "partialSkills": [
            {"name": "System Design", "currentLevel": 75, "requiredLevel": 95},
            {"name": "Cloud Architecture", "currentLevel": 70, "requiredLevel": 90}
        ],
        "recommendations": [
            {
                "title": "Software Architecture: The Hard Parts",
                "provider": "O'Reilly",
                "duration": "3 months",
                "difficulty": "Expert",
                "url": "https://www.oreilly.com/library/view/software-architecture-the/9781492086888/",
                "skillsCovered": ["Architecture Patterns", "Trade-offs", "Best Practices"]
            },
            {
                "title": "Domain-Driven Design Fundamentals",
                "provider": "Pluralsight",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://www.pluralsight.com/courses/domain-driven-design-fundamentals",
                "skillsCovered": ["DDD", "Bounded Contexts", "Event Storming"]
            }
        ]
    },
    "Blockchain Developer": {
        "missingSkills": ["Smart Contracts", "Web3.js", "Solidity", "DeFi Protocols"],
        "partialSkills": [
            {"name": "Ethereum", "currentLevel": 60, "requiredLevel": 85},
            {"name": "Blockchain Security", "currentLevel": 55, "requiredLevel": 80}
        ],
        "recommendations": [
            {
                "title": "Ethereum and Solidity: The Complete Developer's Guide",
                "provider": "Udemy",
                "duration": "3 months",
                "difficulty": "Advanced",
                "url": "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/",
                "skillsCovered": ["Solidity", "Smart Contracts", "Web3.js"]
            },
            {
                "title": "DeFi Development Mastery",
                "provider": "ConsenSys Academy",
                "duration": "2 months",
                "difficulty": "Expert",
                "url": "https://consensys.net/academy/",
                "skillsCovered": ["DeFi", "Smart Contracts", "Blockchain Security"]
            }
        ]
    },
    "Security Engineer": {
        "missingSkills": ["Penetration Testing", "Security Architecture", "Threat Modeling", "Incident Response"],
        "partialSkills": [
            {"name": "Network Security", "currentLevel": 70, "requiredLevel": 90},
            {"name": "Application Security", "currentLevel": 65, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "Certified Ethical Hacker (CEH)",
                "provider": "EC-Council",
                "duration": "4 months",
                "difficulty": "Advanced",
                "url": "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
                "skillsCovered": ["Penetration Testing", "Security Tools", "Ethical Hacking"]
            },
            {
                "title": "CISSP Certification",
                "provider": "ISC²",
                "duration": "6 months",
                "difficulty": "Expert",
                "url": "https://www.isc2.org/Certifications/CISSP",
                "skillsCovered": ["Security Management", "Risk Assessment", "Security Architecture"]
            }
        ]
    },
    "QA Engineer": {
        "missingSkills": ["Test Automation", "Performance Testing", "CI/CD Integration", "API Testing"],
        "partialSkills": [
            {"name": "Manual Testing", "currentLevel": 75, "requiredLevel": 85},
            {"name": "Test Planning", "currentLevel": 65, "requiredLevel": 80}
        ],
        "recommendations": [
            {
                "title": "Test Automation University",
                "provider": "Applitools",
                "duration": "3 months",
                "difficulty": "Intermediate",
                "url": "https://testautomationu.applitools.com/",
                "skillsCovered": ["Selenium", "Cypress", "Test Automation"]
            },
            {
                "title": "ISTQB Advanced Level Test Automation Engineer",
                "provider": "ISTQB",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://www.istqb.org/certifications/test-automation-engineer",
                "skillsCovered": ["Test Architecture", "CI/CD", "Test Frameworks"]
            }
        ]
    },
    "Technical Lead": {
        "missingSkills": ["Team Management", "Technical Planning", "Mentoring", "Project Estimation"],
        "partialSkills": [
            {"name": "Leadership", "currentLevel": 70, "requiredLevel": 90},
            {"name": "Architecture", "currentLevel": 75, "requiredLevel": 85}
        ],
        "recommendations": [
            {
                "title": "Engineering Management for the Rest of Us",
                "provider": "Sarah Drasner",
                "duration": "1 month",
                "difficulty": "Intermediate",
                "url": "https://www.engmanagement.dev/",
                "skillsCovered": ["Engineering Management", "Team Leadership", "Career Development"]
            },
            {
                "title": "Technical Leadership and Communication",
                "provider": "Coursera",
                "duration": "2 months",
                "difficulty": "Advanced",
                "url": "https://www.coursera.org/learn/technical-leadership-communication",
                "skillsCovered": ["Leadership", "Communication", "Project Management"]
            }
        ]
    }
}

# Default response for roles not in the predefined list
DEFAULT_RESPONSE = {
    "missingSkills": ["Relevant Industry Knowledge", "Latest Technologies", "Best Practices"],
    "partialSkills": [
        {"name": "Core Skills", "currentLevel": 60, "requiredLevel": 80},
        {"name": "Specialized Knowledge", "currentLevel": 40, "requiredLevel": 75}
    ],
    "recommendations": [
        {
            "title": "Professional Certificate Program",
            "provider": "Coursera",
            "duration": "3 months",
            "difficulty": "Intermediate",
            "url": "https://www.coursera.org/professional-certificates",
            "skillsCovered": ["Industry Knowledge", "Best Practices"]
        }
    ]
}

@app.route("/api/analyze-skill-gap", methods=["POST"])
def analyze_skill_gap():
    try:
        data = request.json
        logger.debug(f"Received request data: {data}")
        
        role = data.get("role", "")
        skills = data.get("skills", [])
        
        if not role or not skills:
            return jsonify({"error": "Missing role or skills data"}), 400
            
        # Get predefined response based on role or use default
        response = ROLE_RESPONSES.get(role, DEFAULT_RESPONSE)
        return jsonify(response)
            
    except Exception as e:
        logger.error(f"Error in analyze_skill_gap: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True) 