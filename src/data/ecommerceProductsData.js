export const ecommerceProducts = {
    1: {
      name: "Battery",
      categories: ["Exide", "Amaron", "Lucas"],
      products: {
        "Exide": [
          { 
            id: 101, 
            name: "Exide Bike Battery", 
            price: 1999, 
            image: "/battery1.jpg",
            description: "High-performance bike battery with long life and maintenance-free operation",
            specifications: ["12V 5Ah", "Maintenance-free", "2-year warranty"]
          },
          { 
            id: 102, 
            name: "Exide Car Battery", 
            price: 5999, 
            image: "/battery2.jpg",
            description: "Premium car battery with excellent cranking power",
            specifications: ["12V 35Ah", "800 CCA", "3-year warranty"]
          }
        ],
        "Amaron": [
          { 
            id: 103, 
            name: "Amaron Pro Bike Battery", 
            price: 2499, 
            image: "/battery3.jpg",
            description: "Advanced bike battery with enhanced performance",
            specifications: ["12V 7Ah", "Maintenance-free", "3-year warranty"]
          },
          { 
            id: 104, 
            name: "Amaron Go Car Battery", 
            price: 6499, 
            image: "/battery4.jpg",
            description: "Reliable car battery for everyday use",
            specifications: ["12V 40Ah", "850 CCA", "4-year warranty"]
          }
        ],
        "Lucas": [
          { 
            id: 105, 
            name: "Lucas Premium Battery", 
            price: 2299, 
            image: "/battery5.jpg",
            description: "Durable battery with superior performance",
            specifications: ["12V 6Ah", "Low maintenance", "2.5-year warranty"]
          },
          { 
            id: 106, 
            name: "Lucas Heavy Duty Battery", 
            price: 6999, 
            image: "/battery6.jpg",
            description: "Commercial-grade battery for heavy vehicles",
            specifications: ["12V 45Ah", "900 CCA", "5-year warranty"]
          }
        ]
      }
    },
    2: {
      name: "Lights",
      categories: ["Headlights", "Tail Lights", "LED Lights"],
      products: {
        "Headlights": [
          { 
            id: 201, 
            name: "Halogen Headlight", 
            price: 899, 
            image: "/headlight1.jpg",
            description: "Standard halogen headlight with clear visibility",
            specifications: ["55W", "H4 Socket", "3000K color temperature"]
          },
          { 
            id: 202, 
            name: "Xenon Headlight", 
            price: 1499, 
            image: "/headlight2.jpg",
            description: "Bright xenon headlights for better night vision",
            specifications: ["35W", "HID", "6000K color temperature"]
          }
        ],
        "Tail Lights": [
          { 
            id: 203, 
            name: "LED Tail Light", 
            price: 799, 
            image: "/taillight1.jpg",
            description: "Energy-efficient LED tail lights",
            specifications: ["Red LED", "Smoke lens", "Plug-and-play"]
          },
          { 
            id: 204, 
            name: "Smoke Tail Light", 
            price: 999, 
            image: "/taillight2.jpg",
            description: "Stylish smoked tail lights",
            specifications: ["Black housing", "DOT approved", "Easy installation"]
          }
        ],
        "LED Lights": [
          { 
            id: 205, 
            name: "LED Light Strip", 
            price: 499, 
            image: "/led1.jpg",
            description: "Flexible LED light strips for interior/exterior",
            specifications: ["RGB Color", "Waterproof", "Remote control"]
          },
          { 
            id: 206, 
            name: "LED Fog Lights", 
            price: 1299, 
            image: "/led2.jpg",
            description: "Bright LED fog lights for poor weather conditions",
            specifications: ["3000K yellow", "Durable housing", "Anti-glare"]
          }
        ]
      }
    },
    3: {
      name: "Glass",
      categories: ["Windshield", "Side Windows", "Rear Glass"],
      products: {
        "Windshield": [
          { 
            id: 301, 
            name: "Front Windshield", 
            price: 4999, 
            image: "/windshield1.jpg",
            description: "OEM-quality front windshield glass",
            specifications: ["Laminated safety glass", "UV protection", "OE fitment"]
          },
          { 
            id: 302, 
            name: "Tinted Windshield", 
            price: 5999, 
            image: "/windshield2.jpg",
            description: "Premium tinted windshield with heat rejection",
            specifications: ["70% VLT", "IR rejection", "UV protection"]
          }
        ],
        "Side Windows": [
          { 
            id: 303, 
            name: "Power Window Glass", 
            price: 2999, 
            image: "/sidewindow1.jpg",
            description: "Replacement glass for power windows",
            specifications: ["Tempered glass", "Precise fit", "Easy installation"]
          },
          { 
            id: 304, 
            name: "Tinted Side Glass", 
            price: 3499, 
            image: "/sidewindow2.jpg",
            description: "Tinted side window glass for privacy",
            specifications: ["35% VLT", "Solar control", "Scratch-resistant"]
          }
        ],
        "Rear Glass": [
          { 
            id: 305, 
            name: "Rear Windshield", 
            price: 3999, 
            image: "/rearglass1.jpg",
            description: "High-quality rear windshield replacement",
            specifications: ["Heated glass option", "Defroster lines", "OE equivalent"]
          },
          { 
            id: 306, 
            name: "Defogger Glass", 
            price: 4499, 
            image: "/rearglass2.jpg",
            description: "Rear glass with defogger function",
            specifications: ["Built-in defogger", "Quick clear", "Durable"]
          }
        ]
      }
    },
    4: {
      name: "Body Parts",
      categories: ["Bumpers", "Doors", "Hoods"],
      products: {
        "Bumpers": [
          { 
            id: 401, 
            name: "Front Bumper", 
            price: 5999, 
            image: "/bumper1.jpg",
            description: "Replacement front bumper for various models",
            specifications: ["PP material", "Primed for painting", "OE style"]
          },
          { 
            id: 402, 
            name: "Rear Bumper", 
            price: 5499, 
            image: "/bumper2.jpg",
            description: "Durable rear bumper replacement",
            specifications: ["Impact resistant", "Pre-drilled holes", "Easy install"]
          }
        ],
        "Doors": [
          { 
            id: 403, 
            name: "Front Left Door", 
            price: 7999, 
            image: "/door1.jpg",
            description: "Complete door assembly with hardware",
            specifications: ["Skin only", "With window regulator", "Primed surface"]
          },
          { 
            id: 404, 
            name: "Rear Right Door", 
            price: 7499, 
            image: "/door2.jpg",
            description: "Replacement rear door panel",
            specifications: ["Complete assembly", "Color matched", "With hinges"]
          }
        ],
        "Hoods": [
          { 
            id: 405, 
            name: "Bonnet Hood", 
            price: 8999, 
            image: "/hood1.jpg",
            description: "OEM-style bonnet hood replacement",
            specifications: ["Steel construction", "Pre-drilled holes", "Primed"]
          },
          { 
            id: 406, 
            name: "Carbon Fiber Hood", 
            price: 12999, 
            image: "/hood2.jpg",
            description: "Lightweight carbon fiber performance hood",
            specifications: ["5.5 lbs weight", "Aerodynamic", "UV protected"]
          }
        ]
      }
    },
    5: {
      name: "Tyre",
      categories: ["MRF", "Apollo", "CEAT"],
      products: {
        "MRF": [
          { 
            id: 501, 
            name: "MRF ZVTS 175/65 R14", 
            price: 4999, 
            image: "/tyre1.jpg",
            description: "High-performance radial tyre for sedans",
            specifications: ["175/65 R14", "Tubeless", "Fuel efficient"]
          },
          { 
            id: 502, 
            name: "MRF Wanderer 155/70 R13", 
            price: 4299, 
            image: "/tyre2.jpg",
            description: "All-season tyre for compact cars",
            specifications: ["155/70 R13", "Good wet grip", "Long tread life"]
          }
        ],
        "Apollo": [
          { 
            id: 503, 
            name: "Apollo Amazer 165/80 R14", 
            price: 4599, 
            image: "/tyre3.jpg",
            description: "Durable and comfortable touring tyre",
            specifications: ["165/80 R14", "Low noise", "All-season"]
          },
          { 
            id: 504, 
            name: "Apollo Alnac 185/65 R15", 
            price: 5299, 
            image: "/tyre4.jpg",
            description: "Premium tyres with excellent grip",
            specifications: ["185/65 R15", "4D Nano Design", "Hydroplaning resistance"]
          }
        ],
        "CEAT": [
          { 
            id: 505, 
            name: "CEAT SecuraDrive 155/65 R13", 
            price: 3999, 
            image: "/tyre5.jpg",
            description: "Budget-friendly tyres with good performance",
            specifications: ["155/65 R13", "Fuel saver", "Comfort ride"]
          },
          { 
            id: 506, 
            name: "CEAT Milaze 165/70 R14", 
            price: 4499, 
            image: "/tyre6.jpg",
            description: "Stylish tyres with excellent handling",
            specifications: ["165/70 R14", "Enhanced cornering", "Durable"]
          }
        ]
      }
    }
  };
  
  export const ecommerceItems = [
    { id: 1, name: "Battery" },
    { id: 2, name: "Lights" },
    { id: 3, name: "Glass" },
    { id: 4, name: "Body Parts" },
    { id: 5, name: "Tyre" }
  ];