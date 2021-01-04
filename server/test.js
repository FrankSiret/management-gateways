process.env.NODE_ENV = 'test'
process.env.MONGODB_URI = 'mongodb://localhost/gateways_db__test'

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

const GatewayModel = require('./models/gateways.model')
const DeviceModel = require('./models/devices.model')

const app = require('./index')

describe('Test Gateway', () => {
    beforeEach((done) => {
        GatewayModel.deleteMany({}, (err) => {
            if (err) return done(err)
            DeviceModel.deleteMany({}, (err) => {
                if (err) return done(err)
                done()
            })
        })
    })

    describe('GET /api/v1/gateways', () => {
        it('respond with json containing an array of gateways and it should be blank', done => {
            chai.request(app)
                .get('/api/v1/gateways')
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(200);
                    res.body.should.be.eql({ gateways: [] });
                    done();
                });
        })
        it(`respond with json containing only one gateway`, done => {
            let gateway = new GatewayModel({
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            })
            gateway.save(err => {
                if (err) return done(err)
                chai.request(app)
                    .get('/api/v1/gateways/')
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(200);
                        res.body.gateways.should.be.a('array');
                        res.body.gateways.length.should.be.eql(1);
                        done();
                    });
            })
        })
    })

    describe('GET /api/v1/gateways/:id', () => {
        it(`respond with json "Gateway object 'nonvalidid' not found" when the gateway does not exist`, done => {
            chai.request(app)
                .get('/api/v1/gateways/nonvalidid')
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(404);
                    res.body.msg.should.be.eql("Gateway object 'nonvalidid' not found")
                    done();
                })
        })

        it(`respond with json containing a gateway by the given id`, done => {
            let gateway = new GatewayModel({
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            })
            gateway.save((err, gateway) => {
                if (err) return done(err)
                chai.request(app)
                    .get(`/api/v1/gateways/${gateway._id}`)
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(200);
                        res.body.gateway.should.be.a('object')
                        res.body.gateway.should.have.property('serial_number').eql('001');
                        res.body.gateway.should.have.property('readable_name').eql('test');
                        res.body.gateway.should.have.property('ipv4_address').eql('10.0.0.1');
                        res.body.gateway.should.have.property('devices').eql([]);
                        done();
                    })
            })
        })
    })

    describe('POST /api/v1/gateways', () => {
        it(`should not create a Gateway without 'serial_number' field`, done => {
            let gateway = {
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false)
                    res.body.msg.should.be.eql("Enter all field")
                    done();
                })
        })

        it(`should not create a Gateway with invalid 'ipv4_address' field`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.256"
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false)
                    res.body.msg.should.be.eql(`Gateway validation failed: ipv4_address: '${gateway.ipv4_address}' is not a valid IPv4 address`)
                    done();
                })
        })

        it(`should not create a Gateway with duplicate 'serial_number' field`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            const newGateway = new GatewayModel(gateway)
            newGateway.save((err, res) => {
                chai.request(app)
                    .post('/api/v1/gateways')
                    .set('Content-Type', 'application/json')
                    .send(gateway)
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(400);
                        res.body.should.have.property('success').eql(false)
                        res.body.msg.should.be.eql(`Gateway serial number already exist`)
                        done();
                    })
            })
        })

        it('it should not create the Gateway because exceeded the limit of 10 peripheral devices', (done) => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1",
                devices: [
                    { uid: 1, vendor: "test", status: "online" },
                    { uid: 2, vendor: "test", status: "online" },
                    { uid: 3, vendor: "test", status: "online" },
                    { uid: 4, vendor: "test", status: "online" },
                    { uid: 5, vendor: "test", status: "online" },
                    { uid: 6, vendor: "test", status: "online" },
                    { uid: 7, vendor: "test", status: "online" },
                    { uid: 8, vendor: "test", status: "online" },
                    { uid: 9, vendor: "test", status: "online" },
                    { uid: 10, vendor: "test", status: "online" },
                    { uid: 11, vendor: "test", status: "online" }
                ]
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(400);
                    res.body.should.have.property('success').eql(false)
                    res.body.msg.should.be.eql('No more that 10 peripheral devices are allowed for a gateway');
                    done();
                })
        });

        it(`should create a new gateway without devices`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            chai.request(app)
                .post(`/api/v1/gateways`)
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true)
                    res.body.gateway.should.be.a('object')
                    res.body.gateway.should.have.property('serial_number').eql('001');
                    res.body.gateway.should.have.property('readable_name').eql('test');
                    res.body.gateway.should.have.property('ipv4_address').eql('10.0.0.1');
                    res.body.gateway.should.have.property('devices').eql([]);
                    done();
                })
        })

        it(`should create a new gateway with 2 devices`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1",
                devices: [
                    { uid: 1, vendor: "test", status: "online" },
                    { uid: 2, vendor: "test", date_created: "2021-01-03", status: "offline" }
                ]
            }
            chai.request(app)
                .post(`/api/v1/gateways`)
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(201);
                    res.body.should.have.property('success').eql(true)
                    res.body.gateway.should.be.a('object')
                    res.body.gateway.should.have.property('serial_number').eql('001');
                    res.body.gateway.should.have.property('readable_name').eql('test');
                    res.body.gateway.should.have.property('ipv4_address').eql('10.0.0.1');
                    res.body.gateway.devices.length.should.be.eql(2);
                    done();
                })
        })
    })

    describe('POST /api/v1/gateways/:id/devices', () => {
        it(`should not create a Device into non existing Gateway`, done => {
            let device = {
                uid: 1,
                vendor: "test",
                status: "online"
            }
            chai.request(app)
                .post(`/api/v1/gateways/nonvalidid/devices`)
                .set('Content-Type', 'application/json')
                .send(device)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(404);
                    res.body.should.have.property('success').eql(false)
                    res.body.msg.should.be.eql(`Gateway object 'nonvalidid' not found`)
                    done();
                })
        })

        it(`should not create a Device into one Gateway without 'vendor' field`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            let device = {
                uid: 1,
                status: "online"
            }
            const newGateway = new GatewayModel(gateway)
            newGateway.save((err, gateway) => {
                chai.request(app)
                    .post(`/api/v1/gateways/${gateway._id}/devices`)
                    .set('Content-Type', 'application/json')
                    .send(device)
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(400);
                        res.body.should.have.property('success').eql(false)
                        res.body.msg.should.be.eql("Enter all field")
                        done();
                    })
            })
        })

        it(`should not create a Device with invalid 'status' field`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            let device = {
                uid: 1,
                vendor: "test",
                status: "test"
            }
            const newGateway = new GatewayModel(gateway)
            newGateway.save((err, gateway) => {
                chai.request(app)
                    .post(`/api/v1/gateways/${gateway._id}/devices`)
                    .set('Content-Type', 'application/json')
                    .send(device)
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(400);
                        res.body.should.have.property('success').eql(false)
                        res.body.msg.should.be.eql("Device validation failed: status: `test` is not a valid enum value for path `status`.");
                        done();
                    })
            })
        })

        it(`should not create a Device with duplicate 'uid' field`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1",
                devices: [
                    { uid: 1, vendor: "test", status: "online" }
                ]
            }
            let device = {
                uid: 1,
                vendor: "test",
                status: "online"
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    chai.request(app)
                        .post(`/api/v1/gateways/${res.body.gateway._id}/devices`)
                        .set('Content-Type', 'application/json')
                        .send(device)
                        .end((err, res) => {
                            if (err) return done(err)
                            res.should.have.status(400);
                            res.body.should.have.property('success').eql(false)
                            res.body.msg.should.be.eql("Device UID already exist");
                            done();
                        })
                })
        })

        it(`should not create a new Device into a Gateway with 10 periheral devices because exceeded the limit of 10 peripheral devices`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1",
                devices: [
                    { uid: 1, vendor: "test", status: "online" },
                    { uid: 2, vendor: "test", status: "online" },
                    { uid: 3, vendor: "test", status: "online" },
                    { uid: 4, vendor: "test", status: "online" },
                    { uid: 5, vendor: "test", status: "online" },
                    { uid: 6, vendor: "test", status: "online" },
                    { uid: 7, vendor: "test", status: "online" },
                    { uid: 8, vendor: "test", status: "online" },
                    { uid: 9, vendor: "test", status: "online" },
                    { uid: 10, vendor: "test", status: "online" }
                ]
            }
            let device = {
                uid: 11,
                vendor: "test",
                status: "online"
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    chai.request(app)
                        .post(`/api/v1/gateways/${res.body.gateway._id}/devices`)
                        .set('Content-Type', 'application/json')
                        .send(device)
                        .end((err, res) => {
                            if (err) return done(err)
                            res.should.have.status(400);
                            res.body.should.have.property('success').eql(false)
                            res.body.msg.should.be.eql('No more that 10 peripheral devices are allowed for a gateway');
                            done();
                        })
                })
        })
        it(`should create a new Device into one Gateway`, done => {
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1"
            }
            let device = {
                uid: 1,
                vendor: "test",
                status: "online"
            }
            const newGateway = new GatewayModel(gateway)
            newGateway.save((err, gateway) => {
                chai.request(app)
                    .post(`/api/v1/gateways/${gateway._id}/devices`)
                    .set('Content-Type', 'application/json')
                    .send(device)
                    .end((err, res) => {
                        if (err) return done(err)
                        res.should.have.status(201);
                        res.body.should.have.property('success').eql(true)
                        res.body.device.should.be.a('object');
                        res.body.device.should.have.property('uid').eql(1);
                        res.body.device.should.have.property('vendor').eql('test');
                        res.body.device.should.have.property('status').eql('online');
                        done();
                    })
            })
        })
    })

    describe('DELETE /api/v1/devices/:id', () => {

        it('should not delete a Device that does not exist', (done) => {
            chai.request(app)
                .delete(`/api/v1/devices/nonvalidid`)
                .end((err, res) => {
                    if (err) return done(err)
                    res.should.have.status(404);
                    res.body.should.have.property('success').eql(false)
                    res.body.msg.should.be.eql(`Peripheral device object 'nonvalidid' not found`);
                    done();
                })
        })

        it('should delete a Device', (done) => {

            let device = {
                uid: 1,
                vendor: "test",
                status: "online"
            }
            let gateway = {
                serial_number: "001",
                readable_name: "test",
                ipv4_address: "10.0.0.1",
                devices: [device]
            }
            chai.request(app)
                .post('/api/v1/gateways')
                .set('Content-Type', 'application/json')
                .send(gateway)
                .end((err, res) => {
                    if (err) return done(err)
                    chai.request(app)
                        .delete(`/api/v1/devices/${res.body.gateway.devices[0]._id}`)
                        .end((err, res) => {
                            if (err) return done(err)
                            res.should.have.status(200);
                            res.body.should.have.property('success').eql(true)
                            res.body.should.have.property('device').be.a('object')
                            res.body.msg.should.be.eql('Peripheral device deleted successfully');
                            done();
                        })
                })
        })
    })
})