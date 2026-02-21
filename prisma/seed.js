const { PrismaClient, Gender, Role, Status, Jobtype, AppointmentStatus, PaymentMethods, PaymentStatus } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ----------- Seed Doctors -----------
  const doctors = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const doctor = await prisma.doctor.create({
        data: {
          id: faker.string.uuid(),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          specialization: faker.helpers.arrayElement(["Cardiology", "Dermatology", "Pediatrics", "Dentistry", "Orthopedics"]),
          license_number: faker.string.alphanumeric(8),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          department: faker.helpers.arrayElement(["General", "Emergency", "Lab", "Radiology"]),
          availability_status: faker.helpers.arrayElement(["Available", "On Leave", "Busy"]),
          type: faker.helpers.arrayElement([Jobtype.Full, Jobtype.Part]),
        },
      });
      // Assign working days
      await prisma.workingDays.createMany({
        data: Array.from({ length: 5 }).map((_, i) => ({
          doctor_id: doctor.id,
          day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][i],
          start_time: "08:00",
          close_time: "16:00",
        })),
      });
      return doctor;
    })
  );

  // ----------- Seed Patients -----------
  const patients = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      return prisma.patient.create({
        data: {
          id: faker.string.uuid(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
          date_of_birth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
          phone_number: faker.phone.number(),
          address: faker.location.streetAddress(),
          email: faker.internet.email(),
          insurance_provider: faker.company.name(),
          insurance_id: faker.string.alphanumeric(10),
          insurance_name: faker.word.words(2),
          marital_status: faker.helpers.arrayElement(["Single", "Married", "Divorced"]),
          emergency_contact_name: faker.person.fullName(),
          emergency_contact_number: faker.phone.number(),
          relation: faker.helpers.arrayElement(["Father", "Mother", "Brother", "Sister", "Friend"]),
          blood_group: faker.helpers.arrayElement(["A+", "A-", "B+", "B-", "AB+", "O+"]),
          allergies: faker.helpers.arrayElement(["None", "Penicillin", "Peanuts", "Pollen"]),
          privacy_consent: true,
          medical_consent: true,
          service_consent: true,
          medical_conditions: faker.lorem.sentence(),
          medical_history: faker.lorem.paragraph(),
          img: faker.image.avatar(),
          insurance_number: faker.string.alphanumeric(8),
        },
      });
    })
  );

  // ----------- Seed Services -----------
  const services = await prisma.services.createMany({
    data: [
      { service_name: "Consultation", description: "General doctor consultation", price: 50 },
      { service_name: "X-Ray", description: "Chest X-ray examination", price: 120 },
      { service_name: "Blood Test", description: "Basic blood analysis", price: 80 },
      { service_name: "MRI Scan", description: "Magnetic resonance imaging", price: 400 },
      { service_name: "Dental Cleaning", description: "Teeth cleaning procedure", price: 100 },
    ],
  });

  const serviceList = await prisma.services.findMany();

  // ----------- Seed Appointments, Payments, Medical Records -----------
  for (let i = 0; i < 20; i++) {
    const patient = faker.helpers.arrayElement(patients);
    const doctor = faker.helpers.arrayElement(doctors);
    const appointment = await prisma.appointment.create({
      data: {
        patient_id: patient.id,
        doctor_id: doctor.id,
        appointment_date: faker.date.soon({ days: 30 }),
        time: `${faker.number.int({ min: 8, max: 16 })}:00`,
        status: faker.helpers.arrayElement(Object.values(AppointmentStatus)),
        type: faker.helpers.arrayElement(["Checkup", "Emergency", "Follow-up"]),
        reason: faker.lorem.words(5),
        note: faker.lorem.sentence(),
      },
    });

    const payment = await prisma.payment.create({
      data: {
        patient_id: patient.id,
        appointment_id: appointment.id,
        bill_date: new Date(),
        payment_date: faker.date.soon({ days: 10 }),
        discount: faker.number.float({ min: 0, max: 50 }),
        total_amount: 200,
        amount_paid: 150,
        payment_method: faker.helpers.arrayElement(Object.values(PaymentMethods)),
        payment_status: faker.helpers.arrayElement(Object.values(PaymentStatus)),
      },
    });

    await prisma.patientBills.create({
      data: {
        bill_id: payment.id,
        service_id: faker.helpers.arrayElement(serviceList).id,
        service_date: new Date(),
        quantity: 1,
        unit_cost: 200,
        total_cost: 200,
      },
    });

    const medicalRecord = await prisma.medicalRecords.create({
      data: {
        patient_id: patient.id,
        appointment_id: appointment.id,
        doctor_id: doctor.id,
        treatment_plan: faker.lorem.sentence(),
        prescriptions: faker.lorem.words(4),
        lab_requests: faker.lorem.words(3),
        notes: faker.lorem.sentence(),
      },
    });

    await prisma.vitalSigns.create({
      data: {
        patient_id: patient.id,
        medical_id: medicalRecord.id,
        body_temperature: faker.number.float({ min: 36, max: 38 }),
        systolic: faker.number.int({ min: 100, max: 130 }),
        diastolic: faker.number.int({ min: 60, max: 90 }),
        heartRate: faker.number.int({ min: 60, max: 100 }).toString(),
        respiratory_rate: faker.number.int({ min: 12, max: 20 }),
        oxygen_saturation: faker.number.int({ min: 95, max: 100 }),
        weight: faker.number.float({ min: 50, max: 100 }),
        height: faker.number.float({ min: 150, max: 190 }),
      },
    });

    await prisma.diagnosis.create({
      data: {
        patient_id: patient.id,
        medical_id: medicalRecord.id,
        doctor_id: doctor.id,
        symptoms: faker.lorem.words(5),
        diagnosis: faker.lorem.sentence(),
        notes: faker.lorem.sentence(),
        prescribed_medications: faker.lorem.words(3),
        follow_up_plan: faker.lorem.sentence(),
      },
    });

    await prisma.rating.create({
      data: {
        staff_id: doctor.id,
        patient_id: patient.id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
