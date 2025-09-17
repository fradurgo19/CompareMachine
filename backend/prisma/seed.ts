import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@comparemachine.com' },
    update: {},
    create: {
      email: 'admin@comparemachine.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@comparemachine.com' },
    update: {},
    create: {
      email: 'user@comparemachine.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER'
    }
  });

  // Create machinery data
  const machineryData = [
    {
      name: 'CAT 320 Hydraulic Excavator',
      model: '320',
      series: 'Next Generation',
      category: 'EXCAVATORS',
      manufacturer: 'Caterpillar',
      images: [
        'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
        'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
      ],
      price: 285000,
      availability: 'AVAILABLE',
      rating: 4.5,
      specifications: {
        weight: 20.2,
        power: 122,
        maxOperatingWeight: 20200,
        bucketCapacity: 0.91,
        maxDigDepth: 6.52,
        maxReach: 9.9,
        transportLength: 9.53,
        transportWidth: 2.55,
        transportHeight: 3.15,
        engineModel: 'Cat C4.4 ACERT',
        fuelCapacity: 410,
        hydraulicSystem: 'Advanced Hydraulic System'
      }
    },
    {
      name: 'John Deere 850K Crawler Dozer',
      model: '850K',
      series: 'K-Series',
      category: 'BULLDOZERS',
      manufacturer: 'John Deere',
      images: [
        'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
        'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
      ],
      price: 420000,
      availability: 'AVAILABLE',
      rating: 4.7,
      specifications: {
        weight: 18.7,
        power: 215,
        maxOperatingWeight: 18700,
        transportLength: 5.89,
        transportWidth: 3.05,
        transportHeight: 3.12,
        engineModel: 'John Deere PowerTech PSS',
        fuelCapacity: 340
      }
    },
    {
      name: 'Komatsu PC240LC-11 Excavator',
      model: 'PC240LC-11',
      series: 'Dash-11',
      category: 'EXCAVATORS',
      manufacturer: 'Komatsu',
      images: [
        'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
        'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
      ],
      price: 320000,
      availability: 'LIMITED',
      rating: 4.3,
      specifications: {
        weight: 24.1,
        power: 177,
        maxOperatingWeight: 24100,
        bucketCapacity: 1.14,
        maxDigDepth: 6.84,
        maxReach: 10.25,
        transportLength: 10.12,
        transportWidth: 2.8,
        transportHeight: 3.18,
        engineModel: 'Komatsu SAA6D107E-3',
        fuelCapacity: 400,
        hydraulicSystem: 'CLSS (Closed-Load Sensing System)'
      }
    },
    {
      name: 'Volvo L120H Wheel Loader',
      model: 'L120H',
      series: 'H-Series',
      category: 'LOADERS',
      manufacturer: 'Volvo',
      images: [
        'https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg',
        'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'
      ],
      price: 380000,
      availability: 'AVAILABLE',
      rating: 4.6,
      specifications: {
        weight: 17.2,
        power: 240,
        maxOperatingWeight: 17200,
        bucketCapacity: 3.2,
        transportLength: 8.78,
        transportWidth: 2.7,
        transportHeight: 3.45,
        engineModel: 'Volvo D8J',
        fuelCapacity: 300
      }
    }
  ];

  // Create machinery records
  for (const machinery of machineryData) {
    const { specifications, ...machineryDataWithoutSpecs } = machinery;
    
    await prisma.machinery.upsert({
      where: { 
        name_model: {
          name: machineryDataWithoutSpecs.name,
          model: machineryDataWithoutSpecs.model
        }
      },
      update: {},
      create: {
        ...machineryDataWithoutSpecs,
        specifications: {
          create: specifications
        }
      }
    });
  }

  // Create sample joint evaluations
  const jointEvaluations = [
    {
      joint: 1,
      standardDiameter: 65.5,
      structureHousingDiameter: 68.2,
      bushingDiameter: 66.8,
      pinDiameter: 64.1,
      model: '320',
      series: 'Next Generation',
      ott: 'CAT-320-001',
      userId: user.id
    },
    {
      joint: 2,
      standardDiameter: 45.2,
      structureHousingDiameter: 47.8,
      bushingDiameter: 46.5,
      pinDiameter: 44.1,
      model: '850K',
      series: 'K-Series',
      ott: 'JD-850K-002',
      userId: user.id
    }
  ];

  for (const evaluation of jointEvaluations) {
    // Calculate results
    const criterion = evaluation.standardDiameter > 60 ? 1.2 : 1;
    const aeResult = (evaluation.structureHousingDiameter - evaluation.standardDiameter) >= (criterion - 0.2) ? 1 : 0;
    const apResult = (evaluation.structureHousingDiameter - evaluation.pinDiameter) >= criterion ? 1 : 0;
    const epResult = (evaluation.standardDiameter - evaluation.pinDiameter) >= (criterion - 0.2) ? 1 : 0;
    const beResult = (evaluation.bushingDiameter - evaluation.standardDiameter) >= (criterion - 0.2) ? 1 : 0;
    const bpResult = (evaluation.bushingDiameter - evaluation.pinDiameter) >= criterion ? 1 : 0;

    const criteria: string[] = [];
    if (aeResult === 1) {
      criteria.push("MACHINE");
    } else if (apResult === 1) {
      if ((evaluation.structureHousingDiameter - evaluation.standardDiameter) > (evaluation.standardDiameter - evaluation.pinDiameter)) {
        criteria.push("MACHINE");
      } else {
        criteria.push("CHANGE PIN");
      }
    }

    if (epResult === 1) {
      criteria.push("CHANGE PIN");
    }

    if (beResult === 1) {
      criteria.push("CHANGE BUSHINGS");
    } else if (bpResult === 1) {
      if ((evaluation.bushingDiameter - evaluation.standardDiameter) > (evaluation.standardDiameter - evaluation.pinDiameter)) {
        criteria.push("CHANGE BUSHINGS");
      } else {
        criteria.push("CHANGE PIN");
      }
    }

    await prisma.jointEvaluation.upsert({
      where: {
        joint_userId: {
          joint: evaluation.joint,
          userId: evaluation.userId
        }
      },
      update: {},
      create: {
        ...evaluation,
        criterion,
        aeResult,
        apResult,
        epResult,
        beResult,
        bpResult,
        criteria: Array.from(new Set(criteria)),
        photos: []
      }
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin user: admin@comparemachine.com / admin123');
  console.log('👤 Regular user: user@comparemachine.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
