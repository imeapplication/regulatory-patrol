import { ComplianceData } from "../types/compliance";

export const complianceData: ComplianceData = {
  "regulations": {
    "description": "Full compliance plan for a French bike spare parts manufacturing company with 209 employees. Objectives include adherence to EU and French regulations within 12-18 months, covering GDPR, environmental standards, anti-corruption, taxation, and product safety.",
    "domains": [
      {
        "name": "GDPR",
        "description": "Compliance with data protection laws, including appointing a DPO, securing supplier and employee data, and implementing breach protocols. Align with CNIL guidelines for HR and customer data.",
        "man_day_cost": 85,
        "accountableRole": "DPO",
        "managerRole": "IT Director",
        "tasks": [
          {
            "name": "Data Mapping & Inventory",
            "description": "Identify all personal data flows across manufacturing processes, HR, and supply chains.",
            "man_day_cost": 35,
            "roles": ["DPO", "IT", "HR"],
            "subtasks": [
              {
                "name": "Manufacturing Data Inventory",
                "description": "Document personal data used in parts manufacturing and quality control.",
                "man_day_cost": 12,
                "role": ["IT"]
              },
              {
                "name": "HR Data Audit",
                "description": "Review employee records and recruitment processes for GDPR compliance.",
                "man_day_cost": 10,
                "role": ["HR"]
              },
              {
                "name": "Supplier Data Flow Analysis",
                "description": "Map personal data shared with component suppliers and distributors.",
                "man_day_cost": 13,
                "role": ["Procurement"]
              }
            ]
          },
          {
            "name": "Security Implementation",
            "description": "Encrypt sensitive data and conduct penetration testing on manufacturing systems.",
            "man_day_cost": 50,
            "roles": ["IT", "DPO"],
            "subtasks": [
              {
                "name": "Data Encryption Setup",
                "description": "Deploy end-to-end encryption for sensitive manufacturing and customer data.",
                "man_day_cost": 20,
                "role": ["IT"]
              },
              {
                "name": "Vendor Security Assessment",
                "description": "Audit cloud providers and manufacturing software for GDPR-compliant data processing.",
                "man_day_cost": 18,
                "role": ["DPO"]
              },
              {
                "name": "Incident Response Plan",
                "description": "Create a 24/7 breach notification protocol for CNIL.",
                "man_day_cost": 12,
                "role": ["Legal"]
              }
            ]
          }
        ]
      },
      {
        "name": "Environmental Compliance",
        "description": "Align with EU Production Sustainability Directives, REACH, and French waste management rules. Monitor carbon footprint and hazardous material use in manufacturing.",
        "man_day_cost": 95,
        "accountableRole": "Environmental Officer",
        "managerRole": "Operations Director",
        "tasks": [
          {
            "name": "Waste Management System",
            "description": "Implement EU-compliant disposal for manufacturing waste and materials.",
            "man_day_cost": 45,
            "roles": ["EHS Manager", "Production"],
            "subtasks": [
              {
                "name": "Recycling Partner Contract",
                "description": "Sign agreements with certified waste processing companies for manufacturing byproducts.",
                "man_day_cost": 15,
                "role": ["EHS Manager"]
              },
              {
                "name": "Production Line Waste Reduction",
                "description": "Modify assembly processes for waste tracking and minimization.",
                "man_day_cost": 30,
                "role": ["Production"]
              }
            ]
          },
          {
            "name": "Carbon Footprint Reduction",
            "description": "Establish monitoring systems and reduction targets for manufacturing operations.",
            "man_day_cost": 50,
            "roles": ["EHS Manager", "Operations"],
            "subtasks": [
              {
                "name": "Emissions Assessment",
                "description": "Conduct comprehensive audit of manufacturing carbon emissions.",
                "man_day_cost": 20,
                "role": ["EHS Manager"]
              },
              {
                "name": "Sustainable Process Implementation",
                "description": "Redesign high-impact manufacturing processes for lower emissions.",
                "man_day_cost": 30,
                "role": ["Operations"]
              }
            ]
          }
        ]
      },
      {
        "name": "Anti-Corruption & Bribery",
        "description": "Implement Sapin II compliance program, including supplier due diligence and gift policies.",
        "man_day_cost": 65,
        "accountableRole": "Compliance Officer",
        "managerRole": "Legal Director",
        "tasks": [
          {
            "name": "Risk Assessment",
            "description": "Identify high-risk areas in supplier contracts and distribution channels.",
            "man_day_cost": 30,
            "roles": ["Compliance Officer", "Legal"],
            "subtasks": [
              {
                "name": "Supplier Kickback Analysis",
                "description": "Audit payments to component suppliers throughout the supply chain.",
                "man_day_cost": 12,
                "role": ["Legal"]
              },
              {
                "name": "Distribution Channel Review",
                "description": "Scrutinize distributor relationships for potential bribery risks.",
                "man_day_cost": 18,
                "role": ["Compliance Officer"]
              }
            ]
          },
          {
            "name": "Anti-Corruption Training",
            "description": "Develop and deliver tailored training for employees in high-risk positions.",
            "man_day_cost": 35,
            "roles": ["HR", "Compliance Officer"],
            "subtasks": [
              {
                "name": "Training Program Development",
                "description": "Create sector-specific anti-corruption training materials.",
                "man_day_cost": 15,
                "role": ["Compliance Officer"]
              },
              {
                "name": "Training Delivery",
                "description": "Conduct workshops for procurement, sales, and management teams.",
                "man_day_cost": 20,
                "role": ["HR"]
              }
            ]
          }
        ]
      },
      {
        "name": "Taxation & Financial Reporting",
        "description": "Ensure compliance with French tax code (Article 209) and IFRS. Manage R&D credit claims for parts innovation.",
        "man_day_cost": 80,
        "accountableRole": "CFO",
        "managerRole": "Finance Manager",
        "tasks": [
          {
            "name": "R&D Tax Credit Optimization",
            "description": "Document spare parts innovation projects for French CIR claims.",
            "man_day_cost": 35,
            "roles": ["CFO", "R&D"],
            "subtasks": [
              {
                "name": "Project Cost Allocation",
                "description": "Categorize R&D expenses for innovative manufacturing processes.",
                "man_day_cost": 18,
                "role": ["R&D"]
              },
              {
                "name": "CIR Application Filing",
                "description": "Prepare submission to French tax authorities with technical documentation.",
                "man_day_cost": 17,
                "role": ["CFO"]
              }
            ]
          },
          {
            "name": "Transfer Pricing Documentation",
            "description": "Establish compliant pricing policies for intercompany transactions.",
            "man_day_cost": 45,
            "roles": ["CFO", "Legal"],
            "subtasks": [
              {
                "name": "Functional Analysis",
                "description": "Document value-creating functions across manufacturing operations.",
                "man_day_cost": 20,
                "role": ["CFO"]
              },
              {
                "name": "Benchmark Study",
                "description": "Analyze comparable transactions in bike parts manufacturing sector.",
                "man_day_cost": 25,
                "role": ["Legal"]
              }
            ]
          }
        ]
      },
      {
        "name": "Product Safety & Standards",
        "description": "Comply with EU Machinery Directive and ISO standards for bicycle components. Maintain CE marking for all applicable parts.",
        "man_day_cost": 70,
        "accountableRole": "Quality Director",
        "managerRole": "R&D Manager",
        "tasks": [
          {
            "name": "CE Marking Compliance",
            "description": "Update technical documentation for all bike component categories.",
            "man_day_cost": 30,
            "roles": ["QA Manager", "R&D"],
            "subtasks": [
              {
                "name": "Technical File Updates",
                "description": "Revise documentation for braking system components per EN standards.",
                "man_day_cost": 15,
                "role": ["QA Manager"]
              },
              {
                "name": "Testing Coordination",
                "description": "Arrange third-party testing of critical safety components.",
                "man_day_cost": 15,
                "role": ["R&D"]
              }
            ]
          },
          {
            "name": "Quality Management System",
            "description": "Enhance ISO 9001 implementation across manufacturing processes.",
            "man_day_cost": 40,
            "roles": ["QA Manager", "Production"],
            "subtasks": [
              {
                "name": "Process Documentation",
                "description": "Map and document all quality control procedures for parts manufacturing.",
                "man_day_cost": 20,
                "role": ["QA Manager"]
              },
              {
                "name": "Internal Audit Program",
                "description": "Establish regular audits of manufacturing quality processes.",
                "man_day_cost": 20,
                "role": ["Production"]
              }
            ]
          }
        ]
      }
    ]
  }
};
