/**
 * Created   on 30/11/2014.
 */
services.service('StorageService', ['$window','$q', function ($window, $q) {
    var storage = $window.localStorage,
        prefix = "hacelo",
        cart = "";

    this.save = function(pCartData) {
        var saved = true;
        /*try {
            storage.setItem(prefix, angular.toJson(pCartData, false));
        } catch (e) {
            saved = false;
        }*/

        try {
            this.saveToDisk(pCartData);
        } catch (e) {
            saved = false;
        }
        
        return saved;
    };


    this.load = function() {
        //return angular.fromJson(cart);
        return angular.fromJson(storage.getItem(prefix));
    };


    this.loadFile = function(){
        var defer = $q.defer(),
            self = this;
        // This is to ensure device is ready
        setTimeout(function(){
            self.getDataFromDisk().then(function(e){
                cart = e;
                defer.resolve(e);
            });
        }, 4000);


        return defer.promise;
    };


    this.clear = function() {
        this.save("");
    };


    this.saveToDisk = function(pCartData){
        var b = new FileManager(),
            a = new DirManager();

        a.create_r('Printea',Log('created successfully'));
        b.write_file('Printea/','shopping.txt', angular.toJson(pCartData, false) ,Log('wrote sucessful!'));
    };


    this.getDataFromDisk = function(){
        var defer = $q.defer(),
            a = new DirManager(),
            b = new FileManager(),
            c = "" ;

        this.existFolder().then(function(e){
            //console.log(e);
            if(!e){
                b.write_file('Printea/','shopping.txt', null ,function(){

                    b.read_file('Printea/','shopping.txt',function(e){
                        //console.log(e);
                        defer.resolve(e);
                    },function(e){
                        //console.log(e);
                        defer.resolve(e);
                    });
                });
            } else {
                b.read_file('Printea/','shopping.txt',function(e){defer.resolve(e);},function(e){console.log(e);defer.resolve(e)});
            }
        });
        
        return defer.promise;
    };


    this.existFolder = function(){
        var defer = $q.defer(),
            a = new DirManager(),
            c = "" ;

        a.list('Printea/', function(e){
            //console.log(e);
            if(e.length > 0){
                defer.resolve(true);
            } else {
                defer.resolve(false);
            }
        });

        return defer.promise;
    };

}]);