
'use strict';

const express = require('express');
const router = express.Router();
const User = require('./1-user');
const path = require('path');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});


const upload = multer({  storage: storage })

router.get('/', (req, res) => {
    res.json({ message: 'welcome to our api!' });   
});


router.get('/employees', (req, res) => {

    User.find({},(err, users) => {
        if (err) {
            res.status(500).json({ error: err });
        }
        else{
    
            res.status(200).json(users);
        }
    });
});







//router.post("/employee", (req, res) => {
  router.post("/employee",  upload.single('imgUrl'),(req, res) => {
    console.log("aaaa"+req.file.filename);

    const newdata={
  name: req.body.name,
  title: req.body.title,
  sex: req.body.sex,
  startDate:req.body.startDate,
  officePhone: req.body.officePhone,
  cellphone:req.body.cellphone,
  SMS: req.body.SMS,
  Email: req.body.Email,
  imgUrl: req.file.filename,
  //managerId: Schema.Types.ObjectId,
  manager: req.body.manager
    }

    console.log(newdata)
    //User.imgUrl = req.file.filename;
    console.log(User.imgUrl)
    
    if (!req.body.manager) {

        User.create(newdata, (err, employee) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          // success no manager success
          res.status(200).json({ message:"hello" });
          // User.find({}, (err, employee) => {
          //   if (err) {
          //     res.status(500).json({ error: err });
          //   } else {
          //     res.status(200).json({ employee });
          //   }
          // });
        }
      });
    } else {
      //User.create(req.body, (err, employee) => {
        User.create(newdata, (err, employee) => {
        if (err) {
    
          res.status(500).json({ error: err });
        } else {
          User.findById(req.body.manager, (err, manager) => {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              let newManager = Object.assign({}, manager._doc);
              newManager.directReports = [
                ...newManager.directReports,
                employee._id
              ];
              //method
              User.findByIdAndUpdate(
                req.body.manager,
                newManager,
                (err, manager) => {
                  if (err) {
                    res.status(500).json({ error: err });
                  } else {
                    res.status(200).json({ message:"hello" });
            
                  }
                }
              );
            }
          });
        }
      });
    }
  });


  router.put("/employee/:employeeId", (req, res) => {
    console.log("req.body",req.body)
  //router.put("/employee/:employeeId",  upload.single('imgUrl'),(req, res) => {

    User.findByIdAndUpdate(
      //id
      req.params["employeeId"],
      req.body,
      (err, employee) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
    
          if (employee != null) {
            let obj = employee._doc;
            console.log("obj",obj)
            console.log("employee.manager",employee.manager)
            // manager dosen`t change
            if (obj.manager === req.body.manager) {
              User.findByIdAndUpdate(
                req.params["employeeId"],
                req.body,
                (err, employee) => {
                  if (err) {
                    res.status(500).json({ error: err });
                  } else {
                    res.status(200).json({ message:"hello" });
          
                  }
                }
              );
            } else {

          
              if (employee.manager !== null) {
                //obj.manager,-> original manager
                User.findById(obj.manager, (err, manager) => {
                  if (err) {
                    res.status(500).json({ error: err });
                  } else {
                    if (manager !== null) {
                      let newManager = Object.assign({}, manager._doc);
                      newManager.directReports = newManager.directReports.filter(
                        user => user !== req.params["employeeId"]
                      );
                      User.findByIdAndUpdate(
                        obj.manager,
                        newManager,
                        (err, manager) => {
                          if (err) {
                            res.status(500).json({ error: err });
                          }
                        }
                      );
                    }
                  }
                });
              }
  
           
              if (req.body.manager !== null) {
                User.findById(req.body.manager, (err, manager) => {
                  if (err) {
                    res.status(500).json({ error: err });
                  } else {
                    if (manager !== null) {
                      let newManager = Object.assign({}, manager._doc);
                      newManager.directReports = [
                        ...newManager.directReports,
                        obj._id
                      ];
                      User.findByIdAndUpdate(
                        req.body.manager,
                        newManager,
                        (err, manager) => {
                          if (err) {
                            res.status(500).json({ error: err });
                          } else {
                            res.status(200).json({ message:"hello" });



                          }
                        }
                      );
                    }
                  }
                });
              }
            }
          }
        }
      }
    );
  });



router.delete("/employee/:employeeId", (req, res) => {
  //console.log("11111")
    User.findByIdAndRemove(req.params["employeeId"], (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (employee !== null) {
          let obj = employee._doc;
          if (obj.manager !== null) {
   
            User.findById(obj.manager, (err, manager) => {
              if (err) {
                res.status(500).json({ error: err });
              } else {
    
                if (manager !== null) {
                  let newManager = Object.assign({}, manager._doc);
                  let index = newManager.directReports.indexOf(
                    req.params["employeeId"]
                  );
                  newManager.directReports = [
                    ...newManager.directReports.slice(0, index),
                    ...newManager.directReports.slice(
                      index + 1,
                      newManager.directReports.length
                    )
                  ];
              
                  User.findByIdAndUpdate(
                    obj.manager,
                    newManager,
                    (err, manager) => {
                      if (err) {
                        res.status(500).json({ error: err });
                      } else {
                
                        if (obj.directReports.length > 0) {
                 
                          obj.directReports.forEach(report => {
                            User.findById(report, (err, employee) => {
                              if (err) {
                                res.status(500).json({ error: err });
                              } else {
                                if (employee !== null) {
                                  let newReporter = Object.assign(
                                    {},
                                    employee._doc
                                  );
                       
                                  newReporter.manager = obj.manager;
                                  User.findByIdAndUpdate(
                                    report,
                                    newReporter,
                                    (err, employee) => {
                                      if (err) {
                                        res.status(500).json({ error: err });
                                      }
                                    }
                                  );
                                }
                              }  }); });
                      
                          User.findById(obj.manager, (err, manager) => {
                            if (err) {
                              res.status(500).json({ error: err });
                            } else {
                              if (manager !== null) {
                                let newManager = Object.assign({}, manager._doc);
                                newManager.directReports = [
                                  ...newManager.directReports,
                                  ...obj.directReports
                                ];
                                User.findByIdAndUpdate(
                                  obj.manager,
                                  newManager,
                                  (err, manager) => {
                                    if (err) {
                                      res.status(500).json({ error: err });
                                    } else {
                            

                                       User.find({}, (err, employee) => {
                                        if (err) {
                                          res.status(500).json({ error: err });
                                        } else {
                                          res.status(200).json({ employee });
                                        }
                                      }); 
                                    }
                                  }
                                );
                              } else {
                                User.find({}, (err, employee) => {
                                  if (err) {
                                    res.status(500).json({ error: err });
                                  } else {
                                    res.status(200).json({ employee });
                                  }
                                });
                              }
                            }
                          });
                        } else {
                          User.find({}, (err, employee) => {
                            if (err) {
                              res.status(500).json({ error: err });
                            } else {
                              res.status(200).json({ employee });
                            }
                          }); }
                      }
                    }
                  );
                }
              }
            });
          } else {
            User.find({}, (err, employee) => {
              if (err) {
                res.status(500).json({ error: err });
              } else {
                res.status(200).json({ employee });
              }
            });
          }
        } else {
          res.json({ message: "employee doesn`t exist." });
        }
      }
    });
  });



module.exports = router;

