import College from '../models/College.js';

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a college
// @route   POST /api/colleges
// @access  Private
export const createCollege = async (req, res) => {
  const { name, href, category, state, isVisible } = req.body;

  if (!name || !href || !category) {
    return res.status(400).json({ message: 'Please provide all required fields (name, href, category)' });
  }

  try {
    const college = await College.create({
      name,
      href,
      category,
      state: state || '',
      isVisible: isVisible !== undefined ? isVisible : true
    });
    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a college
// @route   PUT /api/colleges/:id
// @access  Private
export const updateCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const { name, href, category, state, isVisible } = req.body;

    if (name) college.name = name;
    if (href) college.href = href;
    if (category) college.category = category;
    if (state !== undefined) college.state = state;
    if (isVisible !== undefined) college.isVisible = isVisible;

    const updated = await college.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a college
// @route   DELETE /api/colleges/:id
// @access  Private
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    await college.deleteOne();
    res.json({ message: 'College removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed function
export const seedColleges = async () => {
  try {
    const count = await College.countDocuments();
    if (count === 0) {
      const defaultColleges = [
        // B.Tech Karnataka
        { name: "RVCE Bangalore", href: "/rv-college-btech-admission-2026", category: "btech-karnataka" },
        { name: "MSRIT Bangalore", href: "/ramaiah-institute-btech-admission-2026", category: "btech-karnataka" },
        { name: "BMSCE Bangalore", href: "/bms-college-of-engineering-bangalore", category: "btech-karnataka" },
        { name: "BMSIT Bangalore", href: "/bmsit-bangalore", category: "btech-karnataka" },
        { name: "DSCE Bangalore", href: "/dayananda-sagar-college-of-engineering-bangalore", category: "btech-karnataka" },
        { name: "Sri MVIT Bangalore", href: "/sri-mvit-bangalore", category: "btech-karnataka" },
        { name: "NMIT Bangalore", href: "/nmit-bangalore", category: "btech-karnataka" },
        { name: "RNSIT Bangalore", href: "/contact?college=rnsit", category: "btech-karnataka" },
        { name: "CMRIT Bangalore", href: "/contact?college=cmrit", category: "btech-karnataka" },
        { name: "NHCE Bangalore", href: "/contact?college=new-horizon", category: "btech-karnataka" },
        { name: "PES University", href: "/contact?college=pes-university", category: "btech-karnataka" },
        { name: "REVA University", href: "/contact?college=reva-university", category: "btech-karnataka" },

        // B.Tech Other States
        { name: "VIT Vellore", href: "/vit-vellore", category: "btech-other-states" },
        { name: "MIT Manipal", href: "/mit-manipal", category: "btech-other-states" },
        { name: "Amrita University", href: "/amrita-vishwa-vidyapeetham", category: "btech-other-states" },
        { name: "BITS Pilani", href: "/bits-pilani", category: "btech-other-states" },
        { name: "KIIT Bhubaneswar", href: "/kiit-university-bhubaneswar-admission-2026", category: "btech-other-states" },
        { name: "SRM Chennai", href: "/srm-university-btech-admission-2026", category: "btech-other-states" },
        { name: "IEM Kolkata", href: "/iem-kolkata-admission-2026", category: "btech-other-states" },
        { name: "Heritage Kolkata", href: "/heritage-institute-of-technology-hitk-kolkata", category: "btech-other-states" },
        { name: "TMSL Kolkata", href: "/techno-main-salt-lake-tmsl-kolkata", category: "btech-other-states" },
        { name: "HIT Haldia", href: "/haldia-institute-of-technology-hit-haldia", category: "btech-other-states" },

        // MBBS Admission India - Rajasthan
        { name: "MGMCH Jaipur", href: "/mahatma-gandhi-medical-college-jaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "NIMS Jaipur", href: "/national-institute-of-medical-sciences-jaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "JNU Jaipur", href: "/jnu-medical-college-jaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "Geetanjali Udaipur", href: "/geetanjali-medical-college-udaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "PMC Udaipur", href: "/pacific-medical-college-udaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "PIMS Udaipur", href: "/pacific-institute-of-medical-sciences-udaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "Ananta Rajsamand", href: "/ananta-medical-college-rajsamand-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },
        { name: "AIIMS Udaipur", href: "/american-international-medical-college-udaipur-admission-2026", category: "mbbs-admission-india", state: "Rajasthan" },

        // MBBS Admission India - Karnataka
        { name: "Ramaiah Medical", href: "/ramaiah-medical-college-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "St. John's Medical", href: "/st-johns-medical-college-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "KIMS Bangalore", href: "/kempegowda-institute-of-medical-sciences-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "Vydehi Medical", href: "/vydehi-institute-of-medical-sciences-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "BGS Medical", href: "/bgs-global-institute-of-medical-sciences-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "Ambedkar Medical", href: "/dr-br-ambedkar-medical-college-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },
        { name: "East Point Medical", href: "/east-point-college-of-medical-sciences-bangalore-admission-2026", category: "mbbs-admission-india", state: "Karnataka" },

        // MBBS Admission India - West Bengal
        { name: "KPC Medical", href: "/kpc-medical-college-kolkata-admission-2026", category: "mbbs-admission-india", state: "West Bengal" },
        { name: "JIMSH Kolkata", href: "/jagannath-gupta-institute-of-medical-sciences-kolkata-admission-2026", category: "mbbs-admission-india", state: "West Bengal" },
        { name: "IQ City Durgapur", href: "/iq-city-medical-college-durgapur-admission-2026", category: "mbbs-admission-india", state: "West Bengal" },
        { name: "ICARE Haldia", href: "/icare-institute-of-medical-sciences-haldia-admission-2026", category: "mbbs-admission-india", state: "West Bengal" },
        { name: "Gouri Devi Durgapur", href: "/gouri-devi-institute-of-medical-sciences-durgapur-admission-2026", category: "mbbs-admission-india", state: "West Bengal" },

        // MBBS Admission India - Uttar Pradesh
        { name: "Sharda Noida", href: "/school-of-medical-sciences-sharda-university-greater-noida-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "Subharti Meerut", href: "/subharti-medical-college-meerut-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "Era Lucknow", href: "/eras-lucknow-medical-college-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "SRMS Bareilly", href: "/sri-ram-murti-smarak-institute-of-medical-sciences-bareilly-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "Rohilkhand Bareilly", href: "/rohilkhand-medical-college-bareilly-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "Hind Barabanki", href: "/hind-institute-of-medical-sciences-barabanki-admission-2026", category: "mbbs-admission-india", state: "Uttar Pradesh" },
        { name: "Muzaffarnagar Medical", href: "/contact?college=muzaffarnagar-medical", category: "mbbs-admission-india", state: "Uttar Pradesh" },

        // MBBS Admission India - Tamil Nadu
        { name: "SRM Chennai", href: "/srm-medical-college-hospital-chennai-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "PSG Coimbatore", href: "/psg-institute-of-medical-sciences-coimbatore-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "Chettinad Chennai", href: "/chettinad-hospital-and-research-institute-chennai-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "Balaji Chennai", href: "/sree-balaji-medical-college-chennai-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "CMC Vellore", href: "/christian-medical-college-vellore-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "Saveetha Chennai", href: "/saveetha-medical-college-chennai-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },
        { name: "Ramachandra Chennai", href: "/sri-ramachandra-medical-college-chennai-admission-2026", category: "mbbs-admission-india", state: "Tamil Nadu" },

        // MBBS Admission India - Odisha
        { name: "KIMS Bhubaneswar", href: "/kalinga-institute-of-medical-sciences-bhubaneswar-admission-2026", category: "mbbs-admission-india", state: "Odisha" },
        { name: "IMS & SUM Bhubaneswar", href: "/institute-of-medical-sciences-sum-hospital-bhubaneswar-admission-2026", category: "mbbs-admission-india", state: "Odisha" },
        { name: "Hi-Tech Bhubaneswar", href: "/hi-tech-medical-college-bhubaneswar-admission-2026", category: "mbbs-admission-india", state: "Odisha" },
        { name: "Hi-Tech Rourkela", href: "/hi-tech-medical-college-rourkela-admission-2026", category: "mbbs-admission-india", state: "Odisha" },
        { name: "DRIEMS Cuttack", href: "/driems-institute-of-health-sciences-cuttack-admission-2026", category: "mbbs-admission-india", state: "Odisha" },

        // Management & Others
        { name: "MBA / PGDM", href: "/courses#mba", category: "management-other-courses" },
        { name: "Law Admissions", href: "/courses", category: "management-other-courses" },
        { name: "BCA", href: "/courses", category: "management-other-courses" },
        { name: "MCA", href: "/courses", category: "management-other-courses" },
        { name: "BBA", href: "/courses", category: "management-other-courses" },
        { name: "Allied Health Sciences", href: "/courses", category: "management-other-courses" }
      ];

      await College.insertMany(defaultColleges);
      console.log('Seeded database with default Colleges!');
    }
  } catch (error) {
    console.error('Error seeding colleges:', error.message);
  }
};
