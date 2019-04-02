Object.prototype.getClassName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

function randomNumero(max) {
	return Math.floor((Math.random()*max)+1);	
}

function containsInArray(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

function removeFromArray(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] === obj) {
			a.splice (i, 1);
		}
	}
}

function vaiColidir(x, y, background) {
	for (var i = 0; i < background.Map.length; i++) {
		var objDoMap = background.Map[i];
		if (objDoMap.MapPosition.X == x
			&& objDoMap.MapPosition.Y == y) {
			return true;
		}
	}
	return false;
}

function vaiColidirExeto(x, y, background, type) {
	for (var i = 0; i < background.Map.length; i++) {
		var objDoMap = background.Map[i];
		if (objDoMap.MapPosition.X == x
			&& objDoMap.MapPosition.Y == y) {
			var vaiColidir = true
			for (var ti = 0; ti < type.length; ti++) {				
				var tp = type[ti];
				vaiColidir = vaiColidir && objDoMap.getClassName() != tp;
			}
			if(vaiColidir) {
				return vaiColidir
			}
		}
	}
	return false;
}

function verificaColisaoComInimigos(player, background) {
	for (var i = 0; i < background.Map.length; i++) {
		var objDoMap = background.Map[i];
		if (objDoMap.getClassName() == 'Inimigo' 
			|| objDoMap.getClassName() == 'Fogo') {
			if (objDoMap.MapPosition.X == player.MapPosition.X
				&& objDoMap.MapPosition.Y == player.MapPosition.Y) {
				player.morrer();
			}			
		}
	}	
}

function MapPosition(options) {
	var that = this;
	that.X = options.x;
	that.Y = options.y;
	
	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}
}

function RealPosition(options) {
	var that = this;
	that.X = options.x;
	that.Y = options.y;
	that.Width = options.w;
	that.Height = options.h;
	
	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
	}
}

function setaRealPositionInicial(obj, background){
	obj.RealPosition.X = obj.MapPosition.X * background.ColumnSize;
	obj.RealPosition.Y = obj.MapPosition.Y * background.LineSize;	
}

function RealImage(options) {
	this.Image = new Image();
	this.Image.src = options.src;
}

function FrameInf(options) {
	var that = this;
	that.AtualIteration = options.atualIteration;
	that.FrameNumber = options.frameNumber;
	that.ActualFrameLine = options.actualFrameLine;
	that.ActualFrameColumn = options.actualFrameColumn;
	that.IntervalChangeFrame = options.intervalChangeFrame;
	that.InicialFrameColumn = options.inicialFrameColumn;
	that.InicialFrameLine = options.inicialFrameLine;
	
	that.setToInicialFrameColumn = function() {
		that.ActualFrameColumn = that.InicialFrameColumn;
	}
	
	that.setToInicialFrameLine = function() {
		that.ActualFrameLine = that.InicialFrameLine;
	}
	
	that.setToInicialFrameColumn();
	that.setToInicialFrameLine();
}

var Controler = new (function() {
	var that = this;
	
	that.teclaUp = "38";
	that.teclaRight = "39";
	that.teclaDown = "40";
	that.teclaLeft = "37";
	that.teclaEspaco = "32";
	that.Keys = new Array();
	
	that.registrarEventos = function() {
		document.onkeydown = function(e) {
			var key = e.keyCode;
			if (key == 0) {
				key = e.charCode;
			}
			if (!containsInArray(that.Keys, key)
				&& (key == that.teclaUp
				|| key == that.teclaRight
				|| key == that.teclaDown
				|| key == that.teclaLeft
				|| key == that.teclaEspaco)) {
					that.Keys.push(key);
			}
		}

		document.onkeyup = function(e){
			var key = e.keyCode;
			if (key == 0) {
				key = e.charCode;
			}
			removeFromArray(that.Keys, key);
		}
	}
	
})();

function Background (options) {
	var that = this;
	that.Map = new Array();
	that.ColumnNumber = 16;
	that.LineNumber = 8;
	that.ColumnSize = 50;
	that.LineSize = 50;
	
	if (options) {
		this.width = options.width ? options.width : 0;
		this.height = options.height ? options.height : 0;
		this.htmlElement = options.htmlElement ? options.htmlElement : undefined;
		if (this.htmlElement) {
			this.htmlElementContext = this.htmlElement.getContext('2d');
		}
	}
	
	this.initializeCanvas = function () {
		this.htmlElement.width = this.width;
		this.htmlElement.height = this.height;
	};
	
	this.clear = function() {
		this.htmlElementContext.fillStyle = '#11782F';
		this.htmlElementContext.beginPath();
		this.htmlElementContext.rect(0, 0, this.width, this.height);
		this.htmlElementContext.closePath();
		this.htmlElementContext.fill();
	};
	
	this.removeFromMap = function(mapPosition, type) {
		for (var i = 0; i < this.Map.length; i++) {
			if (this.Map[i].MapPosition.X == mapPosition.X
				&& this.Map[i].MapPosition.Y == mapPosition.Y
				&& this.Map[i].getClassName() == type) {
				this.Map.splice (i, 1);
				break;
			}
		}
	}
	
	this.mapItensLogic = function() {
		for (var i = 0; i < that.Map.length; i++) {
			that.Map[i].logic(that);
		}
	};
	
	this.criarPilaresMap = function() {
		for (var y = 1; y < this.LineNumber; y = y + 2) {
			for (var x = 1; x < this.ColumnNumber; x = x + 2) {
				this.Map.push(new Pilar({x: x, y: y}));
			}
		}
	}
	
	this.logicMapToReal = function() {
		for (var i = 0; i < that.Map.length; i++) {
			var obj = that.Map[i];
			var posicaoQueDeveEstarX = obj.MapPosition.X * that.ColumnSize;
			var posicaoQueDeveEstarY = obj.MapPosition.Y * that.LineSize;
			if (obj.estaAndando === undefined) {
				obj.RealPosition.X = posicaoQueDeveEstarX;
				obj.RealPosition.Y = posicaoQueDeveEstarY;
				//centraliza
				if (obj.RealPosition.X + obj.RealPosition.Width < obj.RealPosition.X + that.ColumnSize) {
					obj.RealPosition.X = obj.RealPosition.X + Math.abs((obj.RealPosition.X + obj.RealPosition.Width) - (obj.RealPosition.X + that.ColumnSize));
				}				
				if (obj.RealPosition.Y + obj.RealPosition.Height < obj.RealPosition.Y + that.ColumnSize) {
					obj.RealPosition.Y = obj.RealPosition.Y + Math.abs((obj.RealPosition.Y + obj.RealPosition.Height) - (obj.RealPosition.Y + that.LineSize));
				}
			} else if (obj.estaAndando) {
				if (obj.RealPosition.X != posicaoQueDeveEstarX) {
					if (obj.RealPosition.X < posicaoQueDeveEstarX) {
						obj.RealPosition.X = Math.abs(obj.RealPosition.X + (that.ColumnSize / 5));
					} else {
						obj.RealPosition.X = Math.abs(obj.RealPosition.X - (that.ColumnSize / 5));
					}
				}
				if (obj.RealPosition.Y != posicaoQueDeveEstarY) {
					if (obj.RealPosition.Y < posicaoQueDeveEstarY) {
						obj.RealPosition.Y = Math.abs(obj.RealPosition.Y + (that.LineSize / 5));
					} else {
						obj.RealPosition.Y = Math.abs(obj.RealPosition.Y - (that.LineSize / 5));
					}					
				}
				if (obj.RealPosition.X == posicaoQueDeveEstarX
					&& obj.RealPosition.Y == posicaoQueDeveEstarY) {
					obj.estaAndando = false;
				}
			}
		}
	};
	
	this.draw = function() {
		for (var i = that.Map.length - 1; i > -1; i--) {
			var obj = that.Map[i];
			obj.draw(that);
		}
	};

	//init:		
	this.initializeCanvas();
};

var TipoFogo = {Central: 0,
					 Esquerda: 1,
					 Direita: 2,
					 Cima: 3,
					 Baixo: 4};

function Fogo(options) {
	var that = this;
	
	that.Tamanho = options.tamanho;
	
	that.Tipo = options.tipo;
	
	that.RealImage = new RealImage({
		src: 'fire_novo2.png'
	});
	that.MapPosition = new MapPosition({
		x: options.x,
		y: options.y
	});
	that.RealPosition = new RealPosition({
		w: 50,
		h: 50
	});
	
	that.FrameInf = new FrameInf({
		atualIteration: 0,
		frameNumber: 15,
		actualFrameLine: options.line,
		actualFrameColumn: options.column,
		intervalChangeFrame: 0,
		inicialFrameColumn: options.column,
		inicialFrameLine: options.line
	});
	
	that.configurarFrameInf = function(opt) {
		that.FrameInf = new FrameInf({
			atualIteration: opt.atualIteration,
			frameNumber: 15,
			actualFrameLine: opt.line,
			actualFrameColumn: opt.column,
			intervalChangeFrame: 0,
			inicialFrameColumn: opt.column,
			inicialFrameLine: opt.line
		});
	}
	
	that.logic = function(background) {
		switch(that.Tipo) {
			case TipoFogo.Central:
				that.configurarFrameInf({column: 0, line: 0, atualIteration: that.FrameInf.AtualIteration});
				
				var i = 1;
				while (i <= that.Tamanho) {
					background.Map.push(new Fogo({x: that.MapPosition.X + i, y: that.MapPosition.Y, tamanho: 0, tipo: TipoFogo.Direita}));
					background.Map.push(new Fogo({x: that.MapPosition.X, y: that.MapPosition.Y + i, tamanho: 0, tipo: TipoFogo.Cima}));
					background.Map.push(new Fogo({x: that.MapPosition.X - i, y: that.MapPosition.Y, tamanho: 0, tipo: TipoFogo.Esquerda}));
					background.Map.push(new Fogo({x: that.MapPosition.X, y: that.MapPosition.Y - i, tamanho: 0, tipo: TipoFogo.Baixo}));
					i++;
				}
				that.Tamanho = 0;		
				
				if (that.FrameInf.AtualIteration > 5 && that.FrameInf.AtualIteration % 5 == 0) {
					that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 0 ? 1 : 0;
				}
				break;
			case TipoFogo.Esquerda:
				that.configurarFrameInf({column: 1, line: 3, atualIteration: that.FrameInf.AtualIteration});
				if (that.FrameInf.AtualIteration > 5 && that.FrameInf.AtualIteration % 5 == 0) {
					that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 1 ? 2 : 1;
				}
				break;
			case TipoFogo.Direita:
				that.configurarFrameInf({column: 1, line: 1, atualIteration: that.FrameInf.AtualIteration});
				
				that.FrameInf.ActualFrameColumn++;
				if (that.FrameInf.ActualFrameColumn > 3) {
					that.FrameInf.ActualFrameColumn = 1;
				}
				break;
			case TipoFogo.Cima:
				that.configurarFrameInf({column: 1, line: 2, atualIteration: that.FrameInf.AtualIteration});
				if (that.FrameInf.AtualIteration > 5 && that.FrameInf.AtualIteration % 5 == 0) {
					that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 1 ? 2 : 1;
				}
				break;
			case TipoFogo.Baixo:
				that.configurarFrameInf({column: 1, line: 4, atualIteration: that.FrameInf.AtualIteration});
				if (that.FrameInf.AtualIteration > 5 && that.FrameInf.AtualIteration % 5 == 0) {
					that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 1 ? 2 : 1;
				}
				break;
		}
		
		if (that.FrameInf.AtualIteration > that.FrameInf.FrameNumber) {
			background.removeFromMap(that.MapPosition, that.getClassName());
		}
		that.FrameInf.AtualIteration++;
	}
	
	that.draw = function(background) {
		background.htmlElementContext.drawImage(
			that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
			that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
    }
}

function Explosao(options) {
	var that = this;
	
	that.RealImage = new RealImage({
		src: 'explosao.png'
	});
	that.MapPosition = new MapPosition({
		x: options.x,
		y: options.y
	});
	that.RealPosition = new RealPosition({
		w: 62,
		h: 60
	});
	
	that.FrameInf = new FrameInf({
		atualIteration: 0,
		frameNumber: 16,
		actualFrameLine: 0,
		actualFrameColumn: 1,
		intervalChangeFrame: 0,
		inicialFrameColumn: 0,
		inicialFrameLine: 0
	});
	
	that.logic = function(background) {
		if (that.FrameInf.AtualIteration <= that.FrameInf.FrameNumber) {
			background.Map.push(new Fogo({x: that.MapPosition.X, y:that.MapPosition.Y, tamanho: 1, tipo: TipoFogo.Central}));
		} else {
			background.removeFromMap(that.MapPosition, that.getClassName());
		}
		that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn + 1;
		that.FrameInf.AtualIteration++;
	}
	
	that.draw = function(background) {
		background.htmlElementContext.drawImage(
			that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
			that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
    }
}

function Pilar(options) {
var that = this;
	
	that.RealImage = new RealImage({
		src: 'coluna.png'
	});
	that.MapPosition = new MapPosition({
		x: options.x,
		y: options.y
	});
	that.RealPosition = new RealPosition({
		w: 50,
		h: 50
	});
	
	that.FrameInf = new FrameInf({
		frameNumber: 0,
		actualFrameLine: 0,
		actualFrameColumn: 0,
		intervalChangeFrame: 0,
		inicialFrameColumn: 0,
		inicialFrameLine: 0
	});
	
	that.logic = function() {
	
	}
	
	that.draw = function(background) {
		background.htmlElementContext.drawImage(
			that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
			that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
    }
}

function Bomb(options) {
	var that = this;
	
	that.contagemExplosao = 0;
	
	that.RealImage = new RealImage({
		src: 'bomb.png'
	});
	that.MapPosition = new MapPosition({
		x: options.x,
		y: options.y
	});
	that.RealPosition = new RealPosition({
		w: 36,
		h: 40
	});
	that.FrameInf = new FrameInf({
		atualIteration: 0,
		frameNumber: 2,
		actualFrameLine: 0,
		actualFrameColumn: 0,
		intervalChangeFrame: 5,
		inicialFrameColumn: 0,
		inicialFrameLine: 0
	});
	
	that.logic = function(background) {
		if (that.contagemExplosao > 3) {
			if (that.contagemExplosao === 4) {
				that.contagemExplosao = 5;
				that.FrameInf.AtualIteration = 0;
			}
			that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 2 ? 3 : 2;
			that.FrameInf.AtualIteration++;
			if (that.FrameInf.AtualIteration > that.FrameInf.IntervalChangeFrame * 3) {
				that.explodir(background);
			}
		} else if (that.FrameInf.AtualIteration > that.FrameInf.IntervalChangeFrame) {
			that.FrameInf.AtualIteration = 0;
			that.FrameInf.ActualFrameColumn = that.FrameInf.ActualFrameColumn == 0 ? 1 : 0;
			that.contagemExplosao++;
		}
		
		that.FrameInf.AtualIteration++;
	}
	
	that.explodir = function(background) {
		background.removeFromMap(that.MapPosition, that.getClassName());
		background.Map.push(new Explosao({x: that.MapPosition.X, y:that.MapPosition.Y}));
	}
	
	that.draw = function(background) {
		background.htmlElementContext.drawImage(
			that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
			that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
    }
}

function Inimigo(options) {
	var that = this;
	
	that.estaAndando = false;
	
	that.RealImage = new RealImage({
		src: 'enemy.png'
	});
	that.MapPosition = new MapPosition({
		x: options.x,
		y: options.y
	});
	
	that.RealPosition = new RealPosition({
		x: 0,
		y: 0,
		w: 43,
		h: 63
	});
	
	that.FrameInf = new FrameInf({
		frameNumber: 1,
		actualFrameLine: 0,
		actualFrameColumn: 0,
		intervalChangeFrame: 0,
		inicialFrameColumn: 0,
		inicialFrameLine: 0
	});
	
	that.logic = function(background) {
		if (!that.estaAndando) {
			that.estaAndando = true;
			var pos = randomNumero(4);
			if (pos == 1) {
				that.moveUp(background);
			} else if (pos == 2) {
				that.moveRight(background);
			} else if (pos == 3) {
				that.moveDown(background);
			} else if (pos == 4) {
				that.moveLeft(background);
			}			
		}		
	}
	
	that.moveLeft = function(background) {
		var x = that.MapPosition.X - 1;
		var	y = that.MapPosition.Y;
		if (that.MapPosition.X > 0 && !vaiColidirExeto(x, y, background, ['Player'])) {
			that.MapPosition.setPosition(x, y);
		}
	}
	
	that.moveRight = function(background) {
		var x = that.MapPosition.X + 1;
		var	y = that.MapPosition.Y;
		if (that.MapPosition.X < background.ColumnNumber && !vaiColidirExeto(x, y, background, ['Player'])) {
			that.MapPosition.setPosition(x, y);
		}
	}
	
	that.moveUp = function(background) {
		var x = that.MapPosition.X;
		var	y = that.MapPosition.Y - 1;
		if (that.MapPosition.Y > 0 && !vaiColidirExeto(x, y, background, ['Player'])) {
			that.MapPosition.setPosition(x, y);
		}
	}
	
	that.moveDown = function(background) {
		var x = that.MapPosition.X;
		var	y = that.MapPosition.Y + 1;
		if (that.MapPosition.Y < background.LineNumber && !vaiColidirExeto(x, y, background, ['Player'])) {
			that.MapPosition.setPosition(x, y);
		}
	}
	
	that.draw = function(background) {
		background.htmlElementContext.drawImage(
			that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
			that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
    }
}

var Player = new (function(){
    var that = this;

	that.morreu = false;
	
	that.MapPosition = new MapPosition({
		x: 0,
		y: 0
	});
	
	that.RealImage = new RealImage({
		src: "bman.png"
	});
	
	that.RealPosition = new RealPosition({
		x: 0,
		y: 0,
		w: 50,
		h: 67
	});
	
	that.FrameInf = new FrameInf({
		frameNumber: 5,
		actualFrameLine: 0,
		actualFrameColumn: 0,
		intervalChangeFrame: 1,
		inicialFrameColumn: 1,
		inicialFrameLine: 1
	});
	
	that.estaAndando = false;
	
	that.logic = function(background) {
		if(!that.morreu) {
			that.moviment(background);
		}
	}
	
	that.moviment = function(background) {
		if (that.estaAndando) {
			var key = that.estaAndando;				
			if (key == Controler.teclaUp) {
				that.moveUp(background);
			} else if (key == Controler.teclaRight) {
				that.moveRight(background);
			} else if (key == Controler.teclaDown) {
				that.moveDown(background);
			} else if (key == Controler.teclaLeft) {
				that.moveLeft(background);
			}
			if (key == Controler.teclaEspaco) {
				removeFromArray(Controler.Keys, key);
				that.putBomb(background);
			}
		} else if (Controler.Keys.length === 0) {
			that.FrameInf.setToInicialFrameColumn();
			return;
		} else {		
			for (var i = 0; i < Controler.Keys.length; i++) {
				var key = Controler.Keys[i];				
				if (key == Controler.teclaUp) {
					that.moveUp(background);
				} else if (key == Controler.teclaRight) {
					that.moveRight(background);
				} else if (key == Controler.teclaDown) {
					that.moveDown(background);
				} else if (key == Controler.teclaLeft) {
					that.moveLeft(background);
				}
				if (key == Controler.teclaEspaco) {
					removeFromArray(Controler.Keys, key);
					that.putBomb(background);
				}
			}
		}
	}
	
	that.moveLeft = function(background) {
		var x = that.MapPosition.X - 1;
		var	y = that.MapPosition.Y;
		that.FrameInf.ActualFrameLine = 3;
		if (that.MapPosition.X > 0 && !vaiColidirExeto(x, y, background, ['Player', 'Inimigo', 'Fogo'])) {
			if (!that.estaAndando) {
				that.estaAndando = Controler.teclaLeft;
				that.MapPosition.setPosition(x, y);
			}
			that.FrameInf.ActualFrameColumn++;
			if (that.FrameInf.ActualFrameColumn >= that.FrameInf.FrameNumber) {
				that.FrameInf.ActualFrameColumn = 0;
			}
		}
	}
	
	that.moveRight = function(background) {
		var x = that.MapPosition.X + 1;
		var	y = that.MapPosition.Y;
		that.FrameInf.ActualFrameLine = 0;
		if (that.MapPosition.X < background.ColumnNumber && !vaiColidirExeto(x, y, background, ['Player', 'Inimigo', 'Fogo'])) {
			if (!that.estaAndando) {
				that.estaAndando = Controler.teclaRight;
				that.MapPosition.setPosition(x, y);
			}
			that.FrameInf.ActualFrameColumn++;
			if (that.FrameInf.ActualFrameColumn >= that.FrameInf.FrameNumber) {
				that.FrameInf.ActualFrameColumn = 0;
			}
		}
	}
	
	that.moveUp = function(background) {
		var x = that.MapPosition.X;
		var	y = that.MapPosition.Y - 1;
		that.FrameInf.ActualFrameLine = 2;
		if (that.MapPosition.Y > 0 && !vaiColidirExeto(x, y, background, ['Player', 'Inimigo', 'Fogo'])) {
			if (!that.estaAndando) {
				that.estaAndando = Controler.teclaUp;
				that.MapPosition.setPosition(x, y);
			}
			that.FrameInf.ActualFrameColumn++;
			if (that.FrameInf.ActualFrameColumn >= that.FrameInf.FrameNumber) {
				that.FrameInf.ActualFrameColumn = 0;
			}
		}
	}
	
	that.moveDown = function(background) {
		var x = that.MapPosition.X;
		var	y = that.MapPosition.Y + 1;
		that.FrameInf.ActualFrameLine = 1;
		if (that.MapPosition.Y < background.LineNumber && !vaiColidirExeto(x, y, background, ['Player', 'Inimigo', 'Fogo'])) {
			if (!that.estaAndando) {
				that.estaAndando = Controler.teclaDown;
				that.MapPosition.setPosition(x, y);
			}
			that.FrameInf.ActualFrameColumn++;
			if (that.FrameInf.ActualFrameColumn >= that.FrameInf.FrameNumber) {
				that.FrameInf.ActualFrameColumn = 0;
			}
		}
	}
	
	that.morrer = function(){
		that.morreu = true;
	}
	
	that.putBomb = function(background) {
		var X = that.MapPosition.X;
		var Y = that.MapPosition.Y;
		
		background.Map.push(new Bomb({x:X, y:Y}));
	}
	
    that.draw = function(background) {
		if(that.morreu) {
			background.htmlElementContext.drawImage(
				that.RealImage.Image, that.RealPosition.Width * 2, that.RealPosition.Height * 4,
				that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
		} else {
			background.htmlElementContext.drawImage(
				that.RealImage.Image, that.RealPosition.Width * that.FrameInf.ActualFrameColumn, that.RealPosition.Height * that.FrameInf.ActualFrameLine,
				that.RealPosition.Width, that.RealPosition.Height, that.RealPosition.X, that.RealPosition.Y, that.RealPosition.Width, that.RealPosition.Height);
		}
    }
})();

var gLoop;
var GameLoop = function(background, player){
	background.clear();	

	background.mapItensLogic();
	verificaColisaoComInimigos(player, background);
	
	background.logicMapToReal();
	
	background.draw();
	gLoop = setTimeout(function (){ GameLoop(background, player); }, 1000 / 12);
}

function main() {
	Controler.registrarEventos();
	
	var background = new Background({
		width: 850,
		height: 500, 
		htmlElement: document.getElementById('c')
	});
	background.Map.push(Player);
	background.criarPilaresMap();
	
	var inimigo = new Inimigo({
		x:1,
		y:6
	});	
	setaRealPositionInicial(inimigo, background);	
	background.Map.push(inimigo);
	
	var inimigo = new Inimigo({
		x:6,
		y:7
	});	
	setaRealPositionInicial(inimigo, background);	
	background.Map.push(inimigo);
	
	var inimigo = new Inimigo({
		x:8,
		y:1
	});	
	setaRealPositionInicial(inimigo, background);	
	background.Map.push(inimigo);
	
	GameLoop(background, Player);
}

//init:
main();