export const DEFAULT_HOME_BODY = {
  biography: {
    heading: 'Biography',
    kicker: '',
    paragraphs: [
      'Dr. Pretom Roy Ovi is a Tenure-Track Assistant Professor in the Department of Data Science at the University of North Texas (UNT), College of Information. He earned his Ph.D. in Information Systems from the University of Maryland, Baltimore County (UMBC) in July 2024, following an M.S. in Information Systems from UMBC (2021) and a B.Sc. in Computer Science and Engineering from Bangladesh University of Engineering and Technology (BUET) (2017). Prior to joining UNT in August 2024, he served as a Research Assistant at UMBC’s Center for Real-time Distributed Sensing and Autonomy (CARDS), where he worked on security, autonomy, and edge intelligence in real-world sensing environments.',
      'Dr. Ovi’s research focuses on building robust and privacy-preserving AI systems, with a strong emphasis on federated learning security. His dissertation, “A Robust Federated Learning Framework against Cyber Intrusions to Ensure Data Confidentiality and Model Integrity,” addresses critical threats to distributed machine learning, including gradient inversion and data reconstruction attacks, membership inference attacks, and adversarial manipulation such as model/data poisoning, backdoor insertion, and evasion attacks. His work develops practical defense strategies that combine quantized privacy risk measurement, differential privacy, secure aggregation, and secure multi-party computation to protect both data confidentiality and model integrity across the training and deployment lifecycle. More broadly, his interests span cybersecurity, privacy-preserving AI, edge computing, wireless communication, and power electronics, with a focus on deployable solutions that work under resource constraints and contested environments.',
      'Dr. Ovi has published peer-reviewed research in top venues including CVPR and ICASSP, along with IEEE and SPIE venues in trustworthy learning and multi-domain operations. Representative publications include “Mixed Quantization Enabled Federated Learning to Tackle Gradient Inversion Attacks” (CVPR 2023) and “Revealing Security Risks in Audio Recognition Systems via Gradient Inversion Attacks” (ICASSP 2024). He has also contributed to work on secured federated training for detecting compromised nodes and attack types (ICMLA 2022), as well as security-aware federated learning for multimodal contested environments (SPIE 2022), among other papers in federated defense strategies and edge intelligence.',
      'His funded project experience includes U.S. Army-supported research on robotic sensing, navigation, and perception for coordinated swarms of unmanned ground vehicles using ROS and lidar-based 3D mapping, and mmWave radar signal processing for detecting moving objects in fully obfuscated environments through field experimentation and robust filtering and detection pipelines. Additional research projects include counterfactual image generation using Causal GANs and AI on the edge, with multimodal (image + audio) learning and deployment on platforms such as Raspberry Pi and NVIDIA Jetson devices.',
      'In teaching and mentoring, Dr. Ovi contributes to both graduate and undergraduate education in data science and machine learning. At UNT, he is scheduled to teach DTSC 3010 (Introduction to Data Science) and DTSC 5505 (Machine Learning for Data Scientists) and has experience supporting courses in data mining and applied machine learning. He has also mentored and supervised undergraduate students across multiple majors, supporting research development and hands-on project work.',
      'Dr. Ovi has received multiple recognitions, including Best Paper Awards at SPIE Defence and Commercial Sensing (2022 and 2023), travel grants from NSF and U.S. Army-supported programs, and professional service roles such as sub-reviewing (including for IEEE ICDM) and mentoring under NSF-funded initiatives. His work has also received public visibility, including a project feature on CBS News in Baltimore, reflecting his focus on research that connects strong technical foundations with real-world impact.',
    ],
  },
  education: {
    heading: 'Education',
    items: [
      {
        degree: 'Ph.D. in Information Systems',
        years: '2020 – 2024 (Graduated: 2024)',
        institution: 'University of Maryland, Baltimore County (UMBC), Baltimore, MD, USA',
        area: 'Privacy-Preserving Artificial Intelligence and Federated Learning',
        dissertationTitle: 'A Robust Federated Learning Framework against Cyber Intrusions to Ensure Data Confidentiality and Model Integrity',
      },
      {
        degree: 'M.S. in Information Systems',
        years: '2020 – 2021 (Graduated: 2021)',
        institution: 'University of Maryland, Baltimore County (UMBC), Baltimore, MD, USA',
        area: 'Data Analytics and Machine Learning',
      },
      {
        degree: 'B.Sc. in Computer Science and Engineering',
        years: '2012 – 2017 (Graduated: 2017)',
        institution: 'Bangladesh University of Engineering and Technology (BUET), Dhaka, Bangladesh',
        area: 'Computer Systems, Algorithms, and Software Engineering',
      },
    ],
  },
  research: {
    heading: 'Current Research Areas',
    intro:
      'My research focuses on building privacy-enhanced and secure machine learning systems that remain reliable when deployed in real-world, distributed, and resource-constrained environments. A core theme of my work is privacy-preserving AI, where models learn from decentralized data without exposing sensitive information. I am particularly interested in strengthening federated learning against privacy leakage and cyber intrusions, and in developing practical methods that balance security, accuracy, and efficiency.',
    scholarUrl: '',
    orcidUrl: '',
    sections: [
      {
        title: 'Privacy-Enhanced Machine Learning',
        paragraphs: [
          'This research develops techniques that protect sensitive information during model training and inference. I study how privacy leaks can occur through model updates, gradients, or intermediate representations, and how to reduce those risks through principled defenses. Key directions include federated learning for decentralized training, differential privacy for limiting individual data exposure, and encryption-based methods for secure computation.',
        ],
      },
      {
        title: 'Federated Learning: Privacy, Efficiency, and Real-World Robustness',
        paragraphs: [
          'My work on federated learning emphasizes three practical goals: (1) privacy preservation, where data stays on local devices and the learning process minimizes exposure; (2) communication efficiency, using aggregation, compression, and lightweight updates to reduce overhead; and (3) heterogeneous data handling, designing methods that remain effective under non-IID client data and varying device capabilities. I am also interested in strengthening FL against adversarial behaviors, including malicious participants and attack-driven model drift, with defenses that are deployable at scale.',
        ],
      },
      {
        title: 'Large Language Modeling with Privacy Guarantees',
        paragraphs: [
          'I explore how to make large language models safer for sensitive applications by integrating privacy-preserving learning into LLM training and deployment. This includes privacy-preserving LLMs that incorporate differential privacy and federated learning to better protect user data, along with methods for efficient training and inference through distillation, quantization, and pruning. A related interest is adaptation to low-resource settings, improving LLM performance for languages and specialized domains where training data is limited.',
        ],
      },
      {
        title: 'Scalable and Explainable Data Mining',
        paragraphs: [
          'A major part of my research is developing data mining methods that remain effective as data grows in size, complexity, and noise. I work on scalable algorithms for large-scale and near real-time analytics, as well as explainable models that make results transparent and actionable, especially in high-stakes domains. I also study anomaly detection for complex data streams, with applications in cybersecurity, sensor systems, and fraud detection.',
        ],
      },
      {
        title: 'Health Informatics and Clinical Decision Support',
        paragraphs: [
          'I am interested in applying machine learning and data mining to improve healthcare decision-making and patient outcomes. This includes predictive analytics for risk prediction and outcome forecasting, clinical decision support systems (CDSS) that assist providers using data-driven recommendations, and NLP for health informatics to extract signals from clinical text such as physician notes and medical records in a way that is both useful and privacy-aware.',
        ],
      },
      {
        title: 'Cybersecurity, Adversarial ML, and IoT Security',
        paragraphs: [
          'My cybersecurity research studies how machine learning systems fail under adversarial pressure and how to harden them. This includes adversarial machine learning and robustness, where small perturbations or manipulations can trigger incorrect predictions, and cyber threat intelligence, using predictive analytics to identify emerging attack patterns. I also work on IoT security, focusing on secure communication, authentication, and resilient deployment for connected devices operating at the edge.',
        ],
      },
    ],
  },
};

