db.geospatialprojections.aggregate([
   {
     $lookup:
       {
         from: "annotations",
         localField: "annotationID",
         foreignField: "_id",
         as: "test"
       }
  }
])