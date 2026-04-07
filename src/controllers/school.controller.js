import prisma from "../config/db.js";


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//  POST /addSchool
export async function AddSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    // ✅ Validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, address, latitude, longitude) are required",
      });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude must be valid numbers",
      });
    }

    
    const school = await prisma.school.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: school,
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
  }
}

//  GET /listSchools
export async function GetAllSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;

    // ✅ Validation
    if (latitude == null || longitude == null) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude must be valid numbers",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    
    const schools = await prisma.school.findMany();

   
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: getDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      data: sortedSchools,
    });

  } catch (error) {
    console.error("List Schools Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}