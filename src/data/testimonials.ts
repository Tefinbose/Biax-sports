export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  headline: string;
  content: string;
  product: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "rev-1",
    name: "Arjun Menon",
    role: "National Karate Competitor",
    location: "Kochi, Kerala",
    rating: 5,
    date: "4 days ago",
    headline: "Unmatched Gi durability & snap on katas",
    content:
      "Ordered the tournament Gi for our state championship trials. The fabric weight is tournament-compliant, reinforced seams have taken months of hard grips without fraying, and it breathes exceptionally well in humid weather.",
    product: "BIAX Pro Karate Gi",
    initials: "AM",
  },
  {
    id: "rev-2",
    name: "Pooja Hegde",
    role: "BJJ Blue Belt & Fitness Coach",
    location: "Bengaluru, Karnataka",
    rating: 5,
    date: "1 week ago",
    headline: "Best rash guard compression fit in India",
    content:
      "The compression fit is elite. The silicon waist-band doesn't roll up mid-roll on the mats, and the flatlock stitching causes zero chafing. Definitely rivaling imported brands at half the price.",
    product: "Stealth Long-Sleeve Rash Guard",
    initials: "PH",
  },
  {
    id: "rev-3",
    name: "Vikram Rathore",
    role: "Dojo Director · Warriors Martial Arts",
    location: "Pune, Maharashtra",
    rating: 5,
    date: "2 weeks ago",
    headline: "Academy bulk order delivered on schedule with flawless embroidery",
    content:
      "We placed a custom order of 45 Gis with our club emblem embroidered. The customer team in Kerala coordinated sizing patiently, and delivery arrived ahead of our grading ceremony. Every student is thrilled.",
    product: "Academy Custom Uniforms",
    initials: "VR",
  },
  {
    id: "rev-4",
    name: "Rahul Sharma",
    role: "Competitive Powerlifter",
    location: "New Delhi",
    rating: 5,
    date: "3 weeks ago",
    headline: "Zero slip, heavy-duty wrist wraps & knee sleeves",
    content:
      "Tested under 220kg squats and bench press reps. The elastic tension doesn't fade after wash, and the velcro locks tight without fraying. Essential equipment for serious lifting sessions.",
    product: "Heavy Duty Power Sleeves",
    initials: "RS",
  },
  {
    id: "rev-5",
    name: "Sneha Nair",
    role: "CrossFit Coach & Marathoner",
    location: "Thiruvananthapuram, Kerala",
    rating: 5,
    date: "1 month ago",
    headline: "Ultra-breathable athletic wear that survives daily washing",
    content:
      "I run in these high-mobility athletic tees 5 days a week. Zero odor retention, sweat evaporates rapidly, and the color hasn't faded even after 30+ cycles. Proud to support a home-grown athletic brand.",
    product: "Apex Dry-Fit Training Tee",
    initials: "SN",
  },
  {
    id: "rev-6",
    name: "Mohammed Faizal",
    role: "Judo 2nd Dan Instructor",
    location: "Hyderabad, Telangana",
    rating: 5,
    date: "1 month ago",
    headline: "Grip collar stiffness is competition grade",
    content:
      "Finding a proper heavyweight judo uniform with the right collar thickness locally was tough until I discovered BIAX. The lapel construction holds up against aggressive grips and throws. 10/10 recommendation.",
    product: "BIAX Heavyweight Judo Gi",
    initials: "MF",
  },
  {
    id: "rev-7",
    name: "Aman Verma",
    role: "Track & Field Sprinter",
    location: "Mumbai, Maharashtra",
    rating: 5,
    date: "2 months ago",
    headline: "Unbeatable 4-way stretch shorts with secure phone pocket",
    content:
      "The lightweight athletic shorts allow complete range of motion during deep lunges, sprint intervals, and box jumps. The zippered pocket prevents my phone from bouncing. Outstanding attention to detail.",
    product: "Pro Velocity Training Shorts",
    initials: "AV",
  },
];
